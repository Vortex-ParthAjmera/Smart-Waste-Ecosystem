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
  { id: "citizen", mark: "C" },
  { id: "municipal", mark: "M" },
  { id: "developer", mark: "D" }
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
        <div className={styles.brand} aria-label={`${t("brandName")} ${t("brandTagline")}`}>
          <span className={styles.brandSeal} aria-hidden="true">SGV</span>
          <span className={styles.brandText}>
            <strong>{t("brandName")}</strong>
            <small>{t("brandTagline")}</small>
          </span>
        </div>

        <div className={styles.topbarActions}>
          <LanguageToggle />
          <div className={styles.provenance} aria-label={t("accessEnvironment")}>
            <span><i className={styles.mossDot} aria-hidden="true" />{t("fictionalAccounts")}</span>
            <span><i className={styles.amberDot} aria-hidden="true" />{t("localDemoFallback")}</span>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.story} aria-labelledby="access-story-title">
          <p className={styles.darkEyebrow}>{t("identityChainEyebrow")}</p>
          <h1 id="access-story-title">{t("loginHeroTitle")}</h1>
          <p className={styles.lead}>{t("loginHeroLead")}</p>

          <ol className={styles.accessChain} aria-label={t("accessVerificationSequence")}>
            <li><span>1</span><small>{t("stepIdentity")}</small></li>
            <li><span>2</span><small>{t("stepAccess")}</small></li>
            <li><span>3</span><small>{t("stepRoleView")}</small></li>
            <li><span>4</span><small>{t("stepAudit")}</small></li>
          </ol>

          <aside className={styles.privacyNote} aria-label={t("demoPrivacyNote")}>
            <span className={styles.privacyStamp}>{t("privacySafe")}</span>
            <p>{t("privacyNoteBody")}</p>
          </aside>
        </section>

        <section className={styles.ticket} data-role={activeRole} aria-labelledby="auth-title">
          <div className={styles.ticketHeader}>
            <div>
              <p className={styles.paperEyebrow}>{t("accessReceiptEyebrow")}</p>
              <h2 id="auth-title">{t("chooseAccess")}</h2>
            </div>
            <span className={styles.demoStamp}>{t("demoAccess")}</span>
          </div>
          <p className={styles.ticketIntro}>{t("ticketIntro")}</p>

          <div className={styles.roleTabs} role="tablist" aria-label={t("chooseAccountRole")}>
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
                <p className={styles.paperEyebrow}>{t("citizenLedgerEyebrow")}</p>
                <h3>{t("citizenSignInTitle")}</h3>
                <p>{t("citizenSignInBody")}</p>
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
                <label htmlFor="citizen-user-id">{t("citizenUserIdLabel")}</label>
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
                <label htmlFor="citizen-password">{t("citizenPasswordLabel")}</label>
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
                    placeholder={t("citizenPasswordPlaceholder")}
                    required
                    type={showCitizenPassword ? "text" : "password"}
                    value={citizenPassword}
                  />
                  <button
                    aria-label={showCitizenPassword ? t("hidePassword") : t("showPassword")}
                    aria-pressed={showCitizenPassword}
                    onClick={() => setShowCitizenPassword((visible) => !visible)}
                    type="button"
                  >
                    {showCitizenPassword ? t("hidePassword") : t("showPassword")}
                  </button>
                </div>
              </div>

              {citizenStatus === "error" && (
                <p className={styles.errorStatus} id="citizen-login-status" role="alert">
                  {t("citizenInvalidCreds")}
                </p>
              )}
              {citizenStatus === "success" && (
                <p className={styles.successStatus} id="citizen-login-status" role="status">
                  {t("citizenAcceptedCreds")}
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
                <p className={styles.paperEyebrow}>{t("municipalReviewEyebrow")}</p>
                <h3>{t("municipalContinueTitle")}</h3>
                <p>{t("municipalContinueBody")}</p>
              </div>
            </div>

            <div className={styles.providerCard}>
              <span className={styles.googleMark} aria-hidden="true">G</span>
              <div>
                <strong>{t("verifiedStaffAccount")}</strong>
                <p id="municipal-login-hint">{t("municipalGoogleHint")}</p>
              </div>
            </div>

            {municipalStatus === "success" && (
              <p className={styles.successStatus} role="status">
                {t("municipalAcceptedDemo")}
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
            <p className={styles.roleHint}>{t("municipalDomainHint")}</p>
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
                <p className={styles.paperEyebrow}>{t("restrictedAccessEyebrow")}</p>
                <h3>{t("iotConsoleTitle")}</h3>
                <p>{t("iotConsoleSubtitle")}</p>
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
                <label htmlFor="developer-user-id">{t("developerUsernameLabel")}</label>
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
                <label htmlFor="developer-password">{t("developerPasswordLabel")}</label>
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
                    placeholder={t("developerPasswordPlaceholder")}
                    required
                    type={showDeveloperPassword ? "text" : "password"}
                    value={developerPassword}
                  />
                  <button
                    aria-label={showDeveloperPassword ? t("hidePassword") : t("showPassword")}
                    aria-pressed={showDeveloperPassword}
                    onClick={() => setShowDeveloperPassword((visible) => !visible)}
                    type="button"
                  >
                    {showDeveloperPassword ? t("hidePassword") : t("showPassword")}
                  </button>
                </div>
              </div>

              {developerStatus === "error" && (
                <p className={styles.errorStatus} id="developer-login-status" role="alert">
                  {t("developerInvalidCreds")}
                </p>
              )}
              {developerStatus === "success" && (
                <p className={styles.successStatus} id="developer-login-status" role="status">
                  {t("developerAcceptedCreds")}
                </p>
              )}

              <button className={styles.primaryButton} type="submit">{t("developerSignIn")}</button>
              <button className={styles.invalidDemoButton} onClick={() => setDeveloperStatus("error")} type="button">
                {t("tryInvalidCredsDemo")}
              </button>
              {developerStatus === "success" && (
                <Link className={styles.dashboardLink} href="/developer">{t("openDeveloperConsole")} <span aria-hidden="true">→</span></Link>
              )}
            </form>
          </section>

          <aside className={styles.credentials} aria-labelledby="credentials-title">
            <div className={styles.credentialsHeader}>
              <p className={styles.paperEyebrow}>{t("seededLocalEyebrow")}</p>
              <span>{t("rehearsalReceipt")}</span>
            </div>
            <h3 id="credentials-title">{t("fictionalCredentialsTitle")}</h3>
            <dl>
              <div><dt>{t("citizenUserIdLabel")}</dt><dd>{CITIZEN_USER_ID}</dd></div>
              <div><dt>{t("citizenPasswordLabel")}</dt><dd>{CITIZEN_PASSWORD}</dd></div>
              <div><dt>{t("municipalOptionLabel")}</dt><dd>{t("continueWithGoogleDemo")}</dd></div>
              <div><dt>{t("developerUsernameLabel")}</dt><dd>{DEVELOPER_USER_ID}</dd></div>
              <div><dt>{t("developerPasswordLabel")}</dt><dd>{DEVELOPER_PASSWORD}</dd></div>
            </dl>
          </aside>
        </section>
      </div>

      <p className={styles.productViewLink}>
        <Link href="/console">{t("backToProductView")} <span aria-hidden="true">→</span></Link>
      </p>
    </main>
  );
}
