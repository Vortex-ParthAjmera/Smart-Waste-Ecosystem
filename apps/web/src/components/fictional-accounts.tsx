"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "./language-toggle";
import styles from "./fictional-accounts.module.css";

const CITIZEN_USER_ID = "citizen-main-fictional";
const CITIZEN_PASSWORD = "demo-citizen-2026";
const DEVELOPER_USER_ID = "iot-admin";
const DEVELOPER_PASSWORD = "demo-dev-2026";

const LOGIN_ROLES = [
  { id: "citizen", label: "Citizen", mark: "C" },
  { id: "municipal", label: "Municipal", mark: "M" },
  { id: "developer", label: "Developer", mark: "D" }
] as const;

export type LoginRole = (typeof LOGIN_ROLES)[number]["id"];
type LoginStatus = "idle" | "error" | "success";

type FictionalAccountsProps = {
  initialRole?: LoginRole;
};

export function FictionalAccounts({ initialRole = "citizen" }: FictionalAccountsProps) {
  const { t } = useLanguage();
  const [activeRole, setActiveRole] = useState<LoginRole>(initialRole);
  const [citizenUserId, setCitizenUserId] = useState(CITIZEN_USER_ID);
  const [citizenPassword, setCitizenPassword] = useState("");
  const [developerUserId, setDeveloperUserId] = useState(DEVELOPER_USER_ID);
  const [developerPassword, setDeveloperPassword] = useState("");
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);
  const [showDeveloperPassword, setShowDeveloperPassword] = useState(false);
  const [citizenStatus, setCitizenStatus] = useState<LoginStatus>("idle");
  const [municipalStatus, setMunicipalStatus] = useState<LoginStatus>("idle");
  const [developerStatus, setDeveloperStatus] = useState<LoginStatus>("idle");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const chooseRole = (role: LoginRole) => {
    setActiveRole(role);
    setCitizenStatus("idle");
    setMunicipalStatus("idle");
    setDeveloperStatus("idle");
  };

  const moveBetweenTabs = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % LOGIN_ROLES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + LOGIN_ROLES.length) % LOGIN_ROLES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = LOGIN_ROLES.length - 1;
    }

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    const nextRole = LOGIN_ROLES[nextIndex];
    if (!nextRole) {
      return;
    }

    chooseRole(nextRole.id);
    tabRefs.current[nextIndex]?.focus();
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
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="SGV 2.0 Smart Waste Ecosystem">
          <span className={styles.brandSeal} aria-hidden="true">SGV</span>
          <span className={styles.brandText}>
            <strong>SGV 2.0</strong>
            <small>Smart Waste Ecosystem</small>
          </span>
        </div>

        <div className={styles.topbarActions}>
          <LanguageToggle />
          <div className={styles.provenance} aria-label="Access environment">
            <span><i className={styles.mossDot} aria-hidden="true" />{t("fictionalAccounts")}</span>
            <span><i className={styles.amberDot} aria-hidden="true" />{t("localDemoFallback")}</span>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.story} aria-labelledby="access-story-title">
          <p className={styles.darkEyebrow}>Identity chain · role-scoped entry</p>
          <h1 id="access-story-title">Every trusted record starts with the right role.</h1>
          <p className={styles.lead}>
            Enter the fictional SGV workspace as a citizen, municipal operator, or developer. Each route reveals only the tools that role is meant to use.
          </p>

          <ol className={styles.accessChain} aria-label="Access verification sequence">
            <li><span>1</span><small>IDENTITY</small></li>
            <li><span>2</span><small>ACCESS</small></li>
            <li><span>3</span><small>ROLE VIEW</small></li>
            <li><span>4</span><small>AUDIT</small></li>
          </ol>

          <aside className={styles.privacyNote} aria-label="Demo privacy note">
            <span className={styles.privacyStamp}>PRIVACY SAFE</span>
            <p>Seeded credentials belong only to fictional rehearsal accounts—never to a real citizen, worker, or device.</p>
          </aside>
        </section>

        <section className={styles.ticket} data-role={activeRole} aria-labelledby="auth-title">
          <div className={styles.ticketHeader}>
            <div>
              <p className={styles.paperEyebrow}>Access receipt · SGV-AUTH-002</p>
              <h2 id="auth-title">{t("chooseAccess")}</h2>
            </div>
            <span className={styles.demoStamp}>DEMO ACCESS</span>
          </div>
          <p className={styles.ticketIntro}>Use the seeded flow that matches the dashboard you need to demonstrate.</p>

          <div className={styles.roleTabs} role="tablist" aria-label="Choose an account role">
            {LOGIN_ROLES.map((role, index) => {
              const selected = activeRole === role.id;

              return (
                <button
                  aria-controls={`login-panel-${role.id}`}
                  aria-selected={selected}
                  className={styles.roleTab}
                  data-role={role.id}
                  id={`login-tab-${role.id}`}
                  key={role.id}
                  onClick={() => chooseRole(role.id)}
                  onKeyDown={(event) => moveBetweenTabs(event, index)}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  tabIndex={selected ? 0 : -1}
                  type="button"
                >
                  <span aria-hidden="true">{role.mark}</span>
                  {t(role.id)}
                </button>
              );
            })}
          </div>

          <section
            aria-labelledby="login-tab-citizen"
            className={styles.rolePanel}
            hidden={activeRole !== "citizen"}
            id="login-panel-citizen"
            role="tabpanel"
            tabIndex={0}
          >
            <div className={styles.panelHeading}>
              <span className={styles.roleSeal} aria-hidden="true">C</span>
              <div>
                <p className={styles.paperEyebrow}>Citizen ledger</p>
                <h3>Sign in to your disposal record</h3>
                <p>Review points, badges, QR access, and traceable disposal history.</p>
              </div>
            </div>

            <form
              className={styles.loginForm}
              onSubmit={(event) => {
                event.preventDefault();
                submitCitizen();
              }}
            >
              <div className={styles.field}>
                <label htmlFor="citizen-user-id">Citizen user ID</label>
                <input
                  aria-invalid={citizenStatus === "error"}
                  autoComplete="username"
                  id="citizen-user-id"
                  onChange={(event) => {
                    setCitizenUserId(event.target.value);
                    setCitizenStatus("idle");
                  }}
                  placeholder="citizen-main-fictional"
                  required
                  type="text"
                  value={citizenUserId}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="citizen-password">Citizen password</label>
                <div className={styles.passwordField}>
                  <input
                    aria-describedby={citizenStatus === "error" ? "citizen-login-status" : undefined}
                    aria-invalid={citizenStatus === "error"}
                    autoComplete="current-password"
                    id="citizen-password"
                    onChange={(event) => {
                      setCitizenPassword(event.target.value);
                      setCitizenStatus("idle");
                    }}
                    placeholder="Enter citizen password"
                    required
                    type={showCitizenPassword ? "text" : "password"}
                    value={citizenPassword}
                  />
                  <button
                    aria-label={showCitizenPassword ? "Hide citizen password" : "Show citizen password"}
                    aria-pressed={showCitizenPassword}
                    onClick={() => setShowCitizenPassword((visible) => !visible)}
                    type="button"
                  >
                    {showCitizenPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {citizenStatus === "error" && (
                <p className={styles.errorStatus} id="citizen-login-status" role="alert">
                  Invalid citizen credentials. Use the seeded citizen credentials below.
                </p>
              )}
              {citizenStatus === "success" && (
                <p className={styles.successStatus} id="citizen-login-status" role="status">
                  Citizen credentials accepted. Continue to the citizen dashboard.
                </p>
              )}

              <button className={styles.primaryButton} type="submit">{t("citizenSignIn")}</button>
              {citizenStatus === "success" && (
                <Link className={styles.dashboardLink} href="/citizen">{t("openCitizenDashboard")} <span aria-hidden="true">→</span></Link>
              )}
            </form>
          </section>

          <section
            aria-labelledby="login-tab-municipal"
            className={styles.rolePanel}
            hidden={activeRole !== "municipal"}
            id="login-panel-municipal"
            role="tabpanel"
            tabIndex={0}
          >
            <div className={styles.panelHeading}>
              <span className={styles.roleSeal} aria-hidden="true">M</span>
              <div>
                <p className={styles.paperEyebrow}>Municipal review</p>
                <h3>Continue to operator tools</h3>
                <p>Open disposal sessions, flagged cases, and zone review workflows.</p>
              </div>
            </div>

            <div className={styles.providerCard}>
              <span className={styles.googleMark} aria-hidden="true">G</span>
              <div>
                <strong>Verified staff account</strong>
                <p id="municipal-login-hint">This local demo mirrors Google sign-in. No real Google request is made.</p>
              </div>
            </div>

            {municipalStatus === "success" && (
              <p className={styles.successStatus} role="status">
                Municipal demo access accepted. Continue to operator tools.
              </p>
            )}

            <button
              aria-describedby="municipal-login-hint"
              className={`${styles.primaryButton} ${styles.googleButton}`}
              onClick={() => setMunicipalStatus("success")}
              type="button"
            >
              <span aria-hidden="true">G</span>
              {t("continueWithGoogle")}
            </button>
            {municipalStatus === "success" && (
              <Link className={styles.dashboardLink} href="/operator">{t("openMunicipalConsole")} <span aria-hidden="true">→</span></Link>
            )}
            <p className={styles.roleHint}>Production access is restricted to verified municipal domains.</p>
          </section>

          <section
            aria-labelledby="login-tab-developer"
            className={styles.rolePanel}
            hidden={activeRole !== "developer"}
            id="login-panel-developer"
            role="tabpanel"
            tabIndex={0}
          >
            <div className={styles.panelHeading}>
              <span className={styles.roleSeal} aria-hidden="true">D</span>
              <div>
                <p className={styles.paperEyebrow}>Restricted access</p>
                <h3>IoT control console</h3>
                <p>ESP32-001 · Edge Gateway · Model Registry</p>
              </div>
            </div>

            <form
              className={styles.loginForm}
              onSubmit={(event) => {
                event.preventDefault();
                submitDeveloper();
              }}
            >
              <div className={styles.field}>
                <label htmlFor="developer-user-id">Developer username</label>
                <input
                  aria-invalid={developerStatus === "error"}
                  autoComplete="username"
                  id="developer-user-id"
                  onChange={(event) => {
                    setDeveloperUserId(event.target.value);
                    setDeveloperStatus("idle");
                  }}
                  placeholder="iot-admin"
                  required
                  type="text"
                  value={developerUserId}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="developer-password">Developer password</label>
                <div className={styles.passwordField}>
                  <input
                    aria-describedby={developerStatus === "error" ? "developer-login-status" : undefined}
                    aria-invalid={developerStatus === "error"}
                    autoComplete="current-password"
                    id="developer-password"
                    onChange={(event) => {
                      setDeveloperPassword(event.target.value);
                      setDeveloperStatus("idle");
                    }}
                    placeholder="Enter developer password"
                    required
                    type={showDeveloperPassword ? "text" : "password"}
                    value={developerPassword}
                  />
                  <button
                    aria-label={showDeveloperPassword ? "Hide developer password" : "Show developer password"}
                    aria-pressed={showDeveloperPassword}
                    onClick={() => setShowDeveloperPassword((visible) => !visible)}
                    type="button"
                  >
                    {showDeveloperPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {developerStatus === "error" && (
                <p className={styles.errorStatus} id="developer-login-status" role="alert">
                  401 Unauthorized — simulated invalid credentials blocked.
                </p>
              )}
              {developerStatus === "success" && (
                <p className={styles.successStatus} id="developer-login-status" role="status">
                  Developer credentials accepted. Continue to the IoT console.
                </p>
              )}

              <button className={styles.primaryButton} type="submit">{t("developerSignIn")}</button>
              <button className={styles.invalidDemoButton} onClick={() => setDeveloperStatus("error")} type="button">
                Try invalid credentials demo
              </button>
              {developerStatus === "success" && (
                <Link className={styles.dashboardLink} href="/developer">{t("openDeveloperConsole")} <span aria-hidden="true">→</span></Link>
              )}
            </form>
          </section>

          <aside className={styles.credentials} aria-labelledby="credentials-title">
            <div className={styles.credentialsHeader}>
              <p className={styles.paperEyebrow}>Seeded / local</p>
              <span>REHEARSAL RECEIPT</span>
            </div>
            <h3 id="credentials-title">Fictional credentials for judging</h3>
            <dl>
              <div><dt>Citizen user ID</dt><dd>{CITIZEN_USER_ID}</dd></div>
              <div><dt>Citizen password</dt><dd>{CITIZEN_PASSWORD}</dd></div>
              <div><dt>Municipal option</dt><dd>Continue with Google demo</dd></div>
              <div><dt>Developer user ID</dt><dd>{DEVELOPER_USER_ID}</dd></div>
              <div><dt>Developer password</dt><dd>{DEVELOPER_PASSWORD}</dd></div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}
