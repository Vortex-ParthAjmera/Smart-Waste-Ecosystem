"use client";

import Link from "next/link";
import { useState } from "react";

const CITIZEN_USER_ID = "citizen-main-fictional";
const CITIZEN_PASSWORD = "demo-citizen-2026";
const DEVELOPER_USER_ID = "iot-admin";
const DEVELOPER_PASSWORD = "demo-dev-2026";

type LoginRole = "citizen" | "municipal" | "developer";
type LoginStatus = "idle" | "error" | "success";

export function FictionalAccounts() {
  const [activeRole, setActiveRole] = useState<LoginRole>("citizen");
  const [citizenUserId, setCitizenUserId] = useState(CITIZEN_USER_ID);
  const [citizenPassword, setCitizenPassword] = useState("");
  const [developerUserId, setDeveloperUserId] = useState(DEVELOPER_USER_ID);
  const [developerPassword, setDeveloperPassword] = useState("");
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);
  const [showDeveloperPassword, setShowDeveloperPassword] = useState(false);
  const [citizenStatus, setCitizenStatus] = useState<LoginStatus>("idle");
  const [municipalStatus, setMunicipalStatus] = useState<LoginStatus>("idle");
  const [developerStatus, setDeveloperStatus] = useState<LoginStatus>("idle");

  const chooseRole = (role: LoginRole) => {
    setActiveRole(role);
    setCitizenStatus("idle");
    setMunicipalStatus("idle");
    setDeveloperStatus("idle");
  };

  const submitCitizen = () => {
    if (citizenUserId.trim() === CITIZEN_USER_ID && citizenPassword === CITIZEN_PASSWORD) {
      setCitizenStatus("success");
      return;
    }

    setCitizenStatus("error");
  };

  const submitDeveloper = () => {
    if (developerUserId.trim() === DEVELOPER_USER_ID && developerPassword === DEVELOPER_PASSWORD) {
      setDeveloperStatus("success");
      return;
    }

    setDeveloperStatus("error");
  };

  return (
    <main className="auth-page">
      <section className="auth-panel login-panel">
        <div className="login-brand">
          <span aria-hidden="true">SGV</span>
          <div>
            <p className="eyebrow">Role login</p>
            <h1>Choose your Smart Waste access</h1>
            <p>Citizen uses user ID + password. Municipal and developer options mirror the reference app demo flows.</p>
          </div>
        </div>

        <div className="login-role-options" role="tablist" aria-label="Login options">
          {(["citizen", "municipal", "developer"] as LoginRole[]).map((role) => (
            <button
              aria-pressed={activeRole === role}
              className={activeRole === role ? "selected" : ""}
              key={role}
              onClick={() => chooseRole(role)}
              type="button"
            >
              <span aria-hidden="true">{role === "citizen" ? "●" : role === "municipal" ? "◆" : "▣"}</span>
              {role === "citizen" ? "Citizen" : role === "municipal" ? "Municipal" : "Developer"}
            </button>
          ))}
        </div>

        {activeRole === "citizen" && (
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitCitizen();
            }}
          >
            <label>
              <span>Citizen user ID</span>
              <input
                autoComplete="username"
                onChange={(event) => {
                  setCitizenUserId(event.target.value);
                  setCitizenStatus("idle");
                }}
                placeholder="citizen-main-fictional"
                type="text"
                value={citizenUserId}
              />
            </label>

            <label>
              <span>Citizen password</span>
              <div className="password-field">
                <input
                  autoComplete="current-password"
                  onChange={(event) => {
                    setCitizenPassword(event.target.value);
                    setCitizenStatus("idle");
                  }}
                  placeholder="Enter citizen password"
                  type={showCitizenPassword ? "text" : "password"}
                  value={citizenPassword}
                />
                <button
                  aria-label={showCitizenPassword ? "Hide citizen password" : "Show citizen password"}
                  onClick={() => setShowCitizenPassword((visible) => !visible)}
                  type="button"
                >
                  {showCitizenPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {citizenStatus === "error" && (
              <p className="login-status login-error" role="alert">
                Invalid citizen credentials. Use the seeded citizen credentials below.
              </p>
            )}
            {citizenStatus === "success" && (
              <p className="login-status login-success" role="status">
                Citizen credentials accepted. Continue to the citizen dashboard.
              </p>
            )}

            <button className="login-submit" type="submit">Sign in as citizen</button>
            {citizenStatus === "success" && <Link className="login-link" href="/citizen">Open citizen dashboard</Link>}
          </form>
        )}

        {activeRole === "municipal" && (
          <section className="login-option-panel">
            <div>
              <p className="eyebrow">Municipal worker console</p>
              <h2>Continue with Google</h2>
              <p>Demo flow for verified sanitation department accounts. No real Google request is made locally.</p>
            </div>
            {municipalStatus === "success" && (
              <p className="login-status login-success" role="status">
                Municipal demo access accepted. Continue to operator tools.
              </p>
            )}
            <button className="login-submit google-login" onClick={() => setMunicipalStatus("success")} type="button">
              <span aria-hidden="true">G</span>
              Continue with Google
            </button>
            {municipalStatus === "success" && <Link className="login-link" href="/operator">Open municipal console</Link>}
            <p className="login-hint">Restricted in production to verified municipal domains.</p>
          </section>
        )}

        {activeRole === "developer" && (
          <form
            className="login-form developer-login-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitDeveloper();
            }}
          >
            <div>
              <p className="eyebrow">Restricted access</p>
              <h2>IoT control console</h2>
              <p>ESP32-001 · Edge Gateway · Model Registry</p>
            </div>
            <label>
              <span>Developer username</span>
              <input
                autoComplete="username"
                onChange={(event) => {
                  setDeveloperUserId(event.target.value);
                  setDeveloperStatus("idle");
                }}
                placeholder="iot-admin"
                type="text"
                value={developerUserId}
              />
            </label>

            <label>
              <span>Developer password</span>
              <div className="password-field">
                <input
                  autoComplete="current-password"
                  onChange={(event) => {
                    setDeveloperPassword(event.target.value);
                    setDeveloperStatus("idle");
                  }}
                  placeholder="Enter developer password"
                  type={showDeveloperPassword ? "text" : "password"}
                  value={developerPassword}
                />
                <button
                  aria-label={showDeveloperPassword ? "Hide developer password" : "Show developer password"}
                  onClick={() => setShowDeveloperPassword((visible) => !visible)}
                  type="button"
                >
                  {showDeveloperPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {developerStatus === "error" && (
              <p className="login-status login-error" role="alert">
                401 Unauthorized — simulated invalid credentials blocked.
              </p>
            )}
            {developerStatus === "success" && (
              <p className="login-status login-success" role="status">
                Developer credentials accepted. Continue to the IoT console.
              </p>
            )}

            <button className="login-submit" type="submit">Sign in as developer</button>
            <button className="invalid-demo-button" onClick={() => setDeveloperStatus("error")} type="button">
              Try invalid credentials demo
            </button>
            {developerStatus === "success" && <Link className="login-link" href="/developer">Open developer console</Link>}
          </form>
        )}

        <div className="demo-credentials" aria-label="Seeded local credentials">
          <h2>Seeded credentials for judging rehearsal</h2>
          <dl>
            <div><dt>Citizen user ID</dt><dd>{CITIZEN_USER_ID}</dd></div>
            <div><dt>Citizen password</dt><dd>{CITIZEN_PASSWORD}</dd></div>
            <div><dt>Municipal option</dt><dd>Continue with Google demo</dd></div>
            <div><dt>Developer user ID</dt><dd>{DEVELOPER_USER_ID}</dd></div>
            <div><dt>Developer password</dt><dd>{DEVELOPER_PASSWORD}</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
