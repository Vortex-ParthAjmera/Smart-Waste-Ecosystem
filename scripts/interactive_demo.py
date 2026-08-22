#!/usr/bin/env python3
"""
Smart Waste Ecosystem — Interactive Terminal CLI Console & Hardware Emulator
Integrates Python libraries (`rich`, `requests`, `qrcode`, `hmac`) for interactive testing.
"""

import os
import sys
import time
import uuid
import hmac
import hashlib
import json
from datetime import datetime, timezone
import requests

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.prompt import Prompt, Confirm
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.syntax import Syntax
except ImportError:
    print("Installing required Python libraries (`rich`, `requests`, `qrcode`)...")
    os.system(f"{sys.executable} -m pip install rich requests qrcode pillow")
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.prompt import Prompt, Confirm
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.syntax import Syntax

try:
    import qrcode
except ImportError:
    os.system(f"{sys.executable} -m pip install qrcode pillow")
    import qrcode

console = Console()

EDGE_GATEWAY_URL = os.getenv("EDGE_GATEWAY_URL", "http://localhost:8000")
DEVICE_HMAC_SECRET = os.getenv("DEVICE_HMAC_SECRET", "sgv-lan-secret-2026-key")
DEVICE_CODE = "ESP32-001"


def compute_hmac_signature(method: str, path: str, device_code: str, timestamp: str, nonce: str, body: bytes) -> str:
    body_hash = hashlib.sha256(body).hexdigest()
    canonical = f"{method.upper()}\n{path}\n{device_code}\n{timestamp}\n{nonce}\n{body_hash}"
    return hmac.new(DEVICE_HMAC_SECRET.encode(), canonical.encode(), hashlib.sha256).hexdigest()


def generate_qr_in_terminal():
    console.print("\n[bold cyan]=== Citizen Opaque QR Generator (Terminal Render) ===[/bold cyan]")
    citizen_id = "cit_priya_sharma"
    token_id = f"SGV-CIT-2026-{uuid.uuid4().hex[:4].upper()}"
    expires_at = datetime.now(timezone.utc).isoformat()

    payload = {
        "schemaVersion": "1.1",
        "messageType": "CITIZEN_DISPOSAL_TOKEN_V1",
        "token": token_id,
        "citizenId": citizen_id,
        "expiresAt": expires_at,
    }
    payload_json = json.dumps(payload, indent=2)

    console.print(Panel(Syntax(payload_json, "json", theme="monokai"), title="Opaque QR Payload", border_style="green"))

    qr = qrcode.QRCode(version=1, box_size=1, border=1)
    qr.add_data(json.dumps(payload))
    qr.make(fit=True)

    console.print("\n[bold gold1]Scan with Municipal Camera/Device:[/bold gold1]")
    matrix = qr.get_matrix()
    for row in matrix:
        line = "".join(["██" if cell else "  " for cell in row])
        console.print(f"  {line}")

    console.print(f"\n[bold green]Token ID:[/bold green] [bold white]{token_id}[/bold white]")
    console.print("[dim]No PII, name, or phone encoded. Privacy preserved.[/dim]\n")


def simulate_hardware_disposal():
    console.print("\n[bold cyan]=== ESP32 Hardware Event Simulator ===[/bold cyan]")

    compartment = Prompt.ask("Select compartment", choices=["WET", "DRY"], default="DRY")
    ir_triggered = Confirm.ask("Trigger IR optical sensor?", default=True)

    if compartment == "WET":
        moisture_val = float(Prompt.ask("Enter moisture % (wet path)", default="64.5"))
        wet_fill = int(Prompt.ask("Enter wet compartment fill %", default="45"))
        dry_fill = int(Prompt.ask("Enter dry compartment fill %", default="20"))
    else:
        moisture_val = float(Prompt.ask("Enter dry-path moisture %", default="18.2"))
        wet_fill = int(Prompt.ask("Enter wet compartment fill %", default="30"))
        dry_fill = int(Prompt.ask("Enter dry compartment fill %", default="52"))

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d%H:%M:%SZ")
    event_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())
    nonce = uuid.uuid4().hex[:12]

    event_payload = {
        "schemaVersion": "1.1",
        "messageId": message_id,
        "messageType": "DISPOSAL_EVENT_V1",
        "deviceCode": DEVICE_CODE,
        "bootId": str(uuid.uuid4()),
        "sequence": 142,
        "occurredAt": now_iso,
        "timeQuality": "DEVICE_SYNCED",
        "firmwareVersion": "smart-waste-esp32-1.0.0",
        "payload": {
            "eventId": event_id,
            "sessionId": session_id,
            "eventSource": "HARDWARE",
            "selectedCompartment": compartment,
            "trigger": {
                "componentCode": f"ir-{compartment.lower()}-1",
                "triggered": ir_triggered,
                "quality": "GOOD",
                "capturedAt": now_iso,
            },
            "measurements": [
                {
                    "componentCode": f"fill-{compartment.lower()}-1",
                    "metric": "FILL_PERCENT",
                    "value": wet_fill if compartment == "WET" else dry_fill,
                    "unit": "PERCENT",
                    "quality": "GOOD",
                },
                {
                    "componentCode": "moisture-dry-1",
                    "metric": "DRY_PATH_MOISTURE",
                    "value": moisture_val,
                    "unit": "PERCENT",
                    "quality": "GOOD",
                },
            ],
            "location": {"latitude": 22.7196, "longitude": 75.8577, "fixQuality": "GPS"},
        },
        "extensions": {},
    }

    body_bytes = json.dumps(event_payload).encode("utf-8")
    path = "/v1/disposal-events"
    signature = compute_hmac_signature("POST", path, DEVICE_CODE, now_iso, nonce, body_bytes)

    headers = {
        "Content-Type": "application/json",
        "X-SGV-Device-Id": DEVICE_CODE,
        "X-SGV-Timestamp": now_iso,
        "X-SGV-Nonce": nonce,
        "X-SGV-Signature": signature,
    }

    console.print(Panel(Syntax(json.dumps(event_payload, indent=2), "json"), title="Signed Hardware Event Payload", border_style="cyan"))

    if Confirm.ask(f"Transmit to FastAPI Edge Gateway at {EDGE_GATEWAY_URL}?", default=True):
        try:
            with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}"), transient=True) as progress:
                progress.add_task(description="Transmitting LAN HMAC Request...", total=None)
                resp = requests.post(f"{EDGE_GATEWAY_URL}{path}", data=body_bytes, headers=headers, timeout=5)

            if resp.status_code in (200, 202):
                console.print(f"\n[bold green]✓ 202 QUEUED_LOCALLY[/bold green] — Response: {resp.text}")
                console.print("[dim]Event successfully committed to SQLite WAL custody.[/dim]\n")
            else:
                console.print(f"\n[bold yellow]Gateway Response ({resp.status_code}):[/bold yellow] {resp.text}")
        except Exception as e:
            console.print(f"\n[bold red]Connection Error:[/bold red] {e}")
            console.print("[dim]Ensure services/edge-gateway FastAPI server is running.[/dim]\n")


def check_edge_health():
    console.print(f"\n[bold cyan]=== Edge Gateway Health & Diagnostics ({EDGE_GATEWAY_URL}) ===[/bold cyan]")
    try:
        resp = requests.get(f"{EDGE_GATEWAY_URL}/healthz", timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            table = Table(title="System Status")
            table.add_column("Component", style="cyan")
            table.add_column("Status", style="green")
            table.add_column("Details", style="dim")

            for k, v in data.items():
                table.add_row(str(k), "OK" if v else "DEGRADED", str(v))
            console.print(table)
        else:
            console.print(f"[bold red]Health check returned status {resp.status_code}[/bold red]")
    except Exception as e:
        console.print(f"[bold red]Edge Gateway unreachable at {EDGE_GATEWAY_URL}: {e}[/bold red]")


def main_menu():
    console.print(
        Panel.fit(
            "[bold green]Swachh Saathi / SGV 2.0 — Smart Waste Ecosystem[/bold green]\n"
            "[dim]Interactive Terminal Shell & Hardware Emulator[/dim]",
            border_style="green",
        )
    )

    while True:
        console.print("\n[bold]Select an action:[/bold]")
        console.print("  [1] Generate Citizen Opaque QR Code (Terminal Render)")
        console.print("  [2] Simulate ESP32 Hardware Disposal Event (Signed HMAC)")
        console.print("  [3] Check Edge Gateway Health & Diagnostics")
        console.print("  [4] Exit Shell")

        choice = Prompt.ask("\nEnter option", choices=["1", "2", "3", "4"], default="1")

        if choice == "1":
            generate_qr_in_terminal()
        elif choice == "2":
            simulate_hardware_disposal()
        elif choice == "3":
            check_edge_health()
        elif choice == "4":
            console.print("\n[bold green]Goodbye![/bold green]\n")
            sys.exit(0)


if __name__ == "__main__":
    main_menu()
