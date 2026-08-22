> **PLAN & STRUCTURE LOCK — v2.0:** This approved scope, stack, repository structure, contracts, ownership map, truth-tier model, and delivery plan must not be changed by contributors or AI agents. Work only inside assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR, contract/document updates, and team notification.

# SGV 2.0 Team and GitHub Workflow

Status: approved collaboration baseline v2.0
Repository: `Vortex-ParthAjmera/Smart-Waste-Ecosystem`
Remote: `https://github.com/Vortex-ParthAjmera/Smart-Waste-Ecosystem.git`
Visibility: private personal-account repository during development
Default branch: `main`
Integration branch: `integration`
Documentation folder: `DOCUMENTATION/`

## 1. Repository description

GitHub description:

> ESP32-powered smart waste collection with offline edge sync, live municipal operations, and auditable citizen credits, verified penalties, and disputes.

The current private personal repository does **not** enforce GitHub rulesets under the account/plan shown during setup. A ruleset screen or saved configuration is not protection when GitHub says it will not be enforced. Section 4 therefore defines mandatory manual governance. If the repository becomes public or moves to an organization/plan that enforces rules, PARTH AJMERA may activate the technical controls in Section 5 after verifying them.

## 2. Team, branches, and responsibilities

| Member | GitHub-linked email | Role | Fixed branch | Primary responsibility |
|---|---|---|---|---|
| PARTH AJMERA | `ajmeraparth.official@gmail.com` | Product Owner, Repository Maintainer, Integration Lead | `team/parth-ajmera-governance` | scope, truth tiers, contracts, issues, reviews, milestone/release merges, demo go/no-go |
| YASHVARDHAN DOBHAL | `yashvardhandobhal944@gmail.com` | Web UI Owner | `team/yashvardhan-dobhal-web-ui` | citizen, municipal, and developer/IoT experiences inside the one Next.js app; Cursor user |
| AASHU JOSHI | `aashujoshisbps@gmail.com` | Cloud API and Rules Owner | `team/aashu-joshi-cloud-api` | auth/RBAC, `/api/v1`, event orchestration, `rules-2.0.0`, ledger/review/simulation controls |
| KRISHNA PANWAR | `krishnapanwar464@gmail.com` | Hardware and Firmware Owner | `team/krishna-panwar-esp32` | dual-compartment hardware, calibration, ESP32 firmware, QR/session and sensor trigger boundary |
| ADITYA SILSWAL | `adiisilswal@gmail.com` | Edge and Local ML Owner | `team/aditya-silswal-edge-gateway` | FastAPI/SQLite edge, device auth, camera capture, local inference orchestration, cloud sync, emulator |
| BHUMIKA SINGH RAWAT | `bhumika282007@gmail.com` | Data, QA, and Release Owner | `team/bhumika-singh-rawat-data-qa` | schema/RLS/seed, CI, security/contract/E2E evidence, release verification |

PARTH AJMERA reviews and merge-commits team PRs. BHUMIKA SINGH RAWAT provides an independent review of PARTH AJMERA-authored work. Boundary PRs also require the affected owner—for example, local ML requires ADITYA SILSWAL, AASHU JOSHI, and BHUMIKA SINGH RAWAT to verify runtime, contract/rules, and evidence respectively.

### Temporary shared GitHub-account constraint

KRISHNA PANWAR and ADITYA SILSWAL currently push through ADITYA SILSWAL's GitHub account. This is a temporary operational constraint, not shared ownership of files and not proof of independent review.

Mandatory controls:

1. They use their separate fixed branches; no commit for one workstream goes to the other's branch.
2. Each clone uses repository-local author identity with `--local`; never change the global identity to impersonate the other member.
3. Commit authors must be the human who performed and reviewed the work; the GitHub push actor may still display as ADITYA SILSWAL's account.
4. PARTH AJMERA reviews every PR from either branch and checks branch, allowed paths, commit author, and evidence.
5. The shared account cannot provide an independent review between KRISHNA PANWAR and ADITYA SILSWAL. Use PARTH AJMERA plus the relevant contract/data reviewer.
6. Never share the account password/token in Git, an issue, a PR, group chat, screenshot, serial log, or AI prompt.
7. Separate GitHub accounts are strongly recommended as soon as practical because they improve attribution, credential safety, review independence, and recovery.

Configure the two local clones exactly:

```bash
# In KRISHNA PANWAR's clone only
git config --local user.name "KRISHNA PANWAR"
git config --local user.email "krishnapanwar464@gmail.com"
git switch team/krishna-panwar-esp32

# In ADITYA SILSWAL's clone only
git config --local user.name "ADITYA SILSWAL"
git config --local user.email "adiisilswal@gmail.com"
git switch team/aditya-silswal-edge-gateway
```

Before every commit, both run:

```bash
git branch --show-current
git config --local --get user.name
git config --local --get user.email
git status --short
```

## 3. Fixed branch topology

```text
main                                      manual-policy protected; demo-ready milestones only
└── integration                           manual-policy protected; team PR target
    ├── team/parth-ajmera-governance
    ├── team/yashvardhan-dobhal-web-ui
    ├── team/aashu-joshi-cloud-api
    ├── team/krishna-panwar-esp32
    ├── team/aditya-silswal-edge-gateway
    └── team/bhumika-singh-rawat-data-qa
```

These eight branches already exist. Do not run `git init`, recreate them, rename them, or create replacement personal branches.

Rules:

1. Each member commits only to their fixed `team/*` branch.
2. Every implementation/documentation PR targets `integration`.
3. Only milestone/release PRs target `main`, always from `integration`.
4. No direct push to `main` or `integration`, even though GitHub cannot currently enforce that rule.
5. Do not force-push, rebase, squash-merge, or delete a persistent team branch.
6. Use normal merge commits into `integration` and from `integration` into `main`.
7. Emergency work still uses the owning team branch and a P0 issue.

## 4. Manual governance for the current private repository

Until enforceable protection is available, PARTH AJMERA applies this checklist manually:

- collaborators promise not to push directly to `main` or `integration`;
- only PARTH AJMERA performs merges into those branches;
- every team change is visible in a PR targeting `integration`;
- every PR states issue, truth tier, allowed paths, contract/schema/rules/model impact, tests, stored provenance fields, and UI truth badges;
- affected checks pass locally and in GitHub Actions when workflows exist;
- relevant owner review is recorded in the PR conversation;
- unresolved comments, failing checks, hidden simulation, Tier 2 backend work, or out-of-scope paths block merge;
- before merging, PARTH AJMERA verifies the base/compare branches and selects **Create a merge commit**;
- after merging, PARTH AJMERA checks the branch log for unexpected direct commits;
- BHUMIKA SINGH RAWAT verifies milestone readiness before `integration -> main`.

Technical absence of enforcement is never treated as permission to bypass the process.

## 5. Future enforceable protection

If GitHub confirms enforcement for this repository, configure both `main` and `integration` to:

- require a pull request before merging;
- require at least one independent approval and relevant CODEOWNERS review;
- dismiss stale approvals or require approval of the latest push;
- require status checks and an up-to-date branch;
- require resolved conversations;
- block force pushes and deletion;
- disable bypass where supported;
- prohibit direct pushes and auto-merge during the event.

Do not claim these controls are active until a deliberate prohibited test proves GitHub blocks it.

## 6. Clone and initial checkout

Each member accepts the invitation, then runs from the directory where the clone should live:

```bash
git clone https://github.com/Vortex-ParthAjmera/Smart-Waste-Ecosystem.git
cd Smart-Waste-Ecosystem
git fetch origin
git switch --track origin/team/<exact-assigned-branch>
git branch --show-current
```

If the local branch already exists, use `git switch team/<exact-assigned-branch>`. Do not run `git init` inside the repository or from its parent directory.

### Exact setup for each existing clone

Run the block for the human using that laptop from inside their cloned `Smart-Waste-Ecosystem` folder. These are repository-local identities; do not add `--global`.

#### PARTH AJMERA

```bash
git fetch --prune origin
git switch --track origin/team/parth-ajmera-governance
git config --local user.name "PARTH AJMERA"
git config --local user.email "ajmeraparth.official@gmail.com"
git status --short --branch
```

#### YASHVARDHAN DOBHAL

```bash
git fetch --prune origin
git switch --track origin/team/yashvardhan-dobhal-web-ui
git config --local user.name "YASHVARDHAN DOBHAL"
git config --local user.email "yashvardhandobhal944@gmail.com"
git status --short --branch
```

Yashvardhan then opens this same repository folder in Cursor and confirms the lower-left branch indicator says `team/yashvardhan-dobhal-web-ui` before using Cursor or an AI agent.

#### AASHU JOSHI

```bash
git fetch --prune origin
git switch --track origin/team/aashu-joshi-cloud-api
git config --local user.name "AASHU JOSHI"
git config --local user.email "aashujoshisbps@gmail.com"
git status --short --branch
```

#### KRISHNA PANWAR

```bash
git fetch --prune origin
git switch --track origin/team/krishna-panwar-esp32
git config --local user.name "KRISHNA PANWAR"
git config --local user.email "krishnapanwar464@gmail.com"
git status --short --branch
```

#### ADITYA SILSWAL

```bash
git fetch --prune origin
git switch --track origin/team/aditya-silswal-edge-gateway
git config --local user.name "ADITYA SILSWAL"
git config --local user.email "adiisilswal@gmail.com"
git status --short --branch
```

#### BHUMIKA SINGH RAWAT

```bash
git fetch --prune origin
git switch --track origin/team/bhumika-singh-rawat-data-qa
git config --local user.name "BHUMIKA SINGH RAWAT"
git config --local user.email "bhumika282007@gmail.com"
git status --short --branch
```

For PARTH AJMERA, whose local branch already exists, use `git switch team/parth-ajmera-governance` instead of the `--track` command. Apply the same replacement on any laptop that reports `fatal: a branch named ... already exists`.

Every member verifies the result:

```bash
git branch --show-current
git config --local --get user.name
git config --local --get user.email
git remote -v
git status --short --branch
```

Before any coding agent is used:

1. root `AGENTS.md` must be an exact copy of `DOCUMENTATION/AGENTS.md`;
2. root `README.md` must be the approved copy of `DOCUMENTATION/README.md`;
3. the member reads root `AGENTS.md` and one assigned issue;
4. the branch, local identity, and clean baseline are verified;
5. secrets are supplied only through approved local/platform configuration.

## 7. Start-of-task workflow

```bash
git switch team/<assigned-branch>
git status --short --branch
git fetch origin
git merge origin/integration
git status --short --branch
```

Then confirm:

- one issue and its requirement IDs;
- truth tier: `TIER_1_REAL`, `TIER_2_PREVIEW`, or `TIER_3_ROADMAP`;
- allowed and forbidden paths;
- input contract/fixture and expected output;
- event sources, ML/evidence sources, and UI truth badges exercised;
- tests and judge-visible evidence;
- dependencies and designated reviewer.

If the merge conflicts outside owned paths, stop and ask PARTH AJMERA plus the affected owner. Do not guess or accept an entire side automatically.

## 8. Issue requirements

Every issue includes:

- task ID and requirement IDs from `17_REQUIREMENTS_TRACEABILITY.md`;
- single accountable owner and fixed branch;
- truth tier;
- exact allowed/forbidden paths;
- dependency issues and frozen contract/model/rules versions;
- Given/When/Then acceptance criteria;
- test commands and evidence type;
- event sources (`HARDWARE`, `RECORDED_HARDWARE`, `SIMULATED`, `SEEDED`);
- ML/evidence sources (`LOCAL_LIVE`, `RECORDED_ML`, `SIMULATED`, `SEEDED`);
- UI truth badges (`REAL`, `RECORDED`, `SIMULATED`, `PREVIEW/SEEDED`);
- demo scene and fallback;
- security/privacy notes.

Tier rules:

- Tier 1 issues require working implementation and evidence.
- Tier 2 issues are UI-fixture-only, begin after Tier 1 freeze, and require a test showing no feature API call.
- Tier 3 creates documentation only; no route, component, table, endpoint, worker, or dependency.

## 9. Commits

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Examples:

```text
feat(firmware): debounce compartment IR triggers
feat(edge): correlate local inference with disposal events
feat(simulation): restrict injected events to demo identities
test(tiers): prevent preview screens from calling feature APIs
docs(governance): record private-repository manual controls
```

Allowed types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`.

Commit rules:

- one coherent purpose;
- no secret, PII, raw camera frame, model artifact without approval, build output, queue DB, dump, or editor state;
- no meaningless “update/final/changes” subject;
- no unrelated formatting or refactor;
- run applicable checks first;
- a human inspects the complete diff before commit and push.

## 10. Required pull-request body

```markdown
## Task
Implements: <issue/task and requirement IDs>

## Outcome
<What now works>

## Truth tier and sources
- Tier: TIER_1_REAL | TIER_2_PREVIEW | TIER_3_ROADMAP
- Event sources exercised: HARDWARE | RECORDED_HARDWARE | SIMULATED | SEEDED | not applicable
- ML/evidence sources exercised: LOCAL_LIVE | RECORDED_ML | SIMULATED | SEEDED | not applicable
- UI truth badges verified: REAL | RECORDED | SIMULATED | PREVIEW/SEEDED | not applicable

## Allowed paths
- <paths from issue>

## Contracts and data
- Contract/schema/rules/model versions:
- Migration/API impact: none | <approved detail>
- Tier 2 backend impact: none (mandatory for Tier 2)

## Verification
- [ ] Applicable format/lint checks
- [ ] Typecheck/compile
- [ ] Unit tests
- [ ] Contract/integration/HIL/E2E tests where required
- [ ] Manual acceptance and fallback scenario

## Evidence
<screenshots, network trace, API receipt, DB assertion, serial log, model manifest/hash, or video>

## Governance
- [ ] I used my fixed branch and repository-local identity.
- [ ] I changed only assigned paths.
- [ ] I did not change scope, stack, structure, contracts, ownership, or tiers without approval.
- [ ] No secret, real PII, retained raw frame, or hidden simulated/preview data is committed.
- [ ] Root AGENTS.md was followed and the diff was reviewed by a human.

## Risks and reviewer focus
<uncertainty and fallback; do not hide it>
```

Additional local-ML evidence: model/framework/class-map versions, weights SHA-256, dataset/provenance/license decision, supported-class tests, measured capture+inference latency, frame-retention result, timeout/multiple/unknown cases, and `RECORDED_ML` fallback.

Additional simulation evidence: role/flag/rate-limit/idempotency tests, fixed fictional identities, audit row, persistent `SIMULATED` label, and exclusion from hardware proof counts.

## 11. Review and merge

### Team branch to `integration`

1. Author merges current `origin/integration` into the fixed team branch.
2. Author resolves only owned-path conflicts and runs applicable checks.
3. Author opens/updates one scoped PR with the required body and evidence.
4. Relevant owner verifies any contract, schema, hardware, ML, security, or UI boundary.
5. PARTH AJMERA verifies scope, tier, paths, stored provenance, rendered truth badges, acceptance, and current checks.
6. All conversations are resolved.
7. PARTH AJMERA selects **Create a merge commit**.
8. Members merge updated `origin/integration` back into their own branches.

### `integration` to `main`

1. BHUMIKA SINGH RAWAT completes the release/evidence checklist.
2. No P0 issue is open; every Tier 1 release row has proof.
3. Preview surfaces have labels and no forbidden backend.
4. PARTH AJMERA runs the frozen demo smoke/fallback test.
5. PARTH AJMERA opens and merge-commits the milestone PR.
6. Release record states any live, recorded, simulated, or previewed element used.

Never squash-merge or rebase a reused persistent branch.

## 12. Required checks

Use stable workflow/check names once implemented:

- `web-quality` — format, lint, strict typecheck, unit test, production build;
- `edge-quality` — Ruff/format, Pytest, SQLite durability/retry, camera/local-ML integration;
- `firmware-build` — PlatformIO clean compile and contract/HIL fixture compatibility;
- `database-quality` — migrations, RLS, seed/ledger/badge reconciliation;
- `contract-quality` — schema/OpenAPI and cross-runtime fixtures;
- `integration-smoke` — QR → hardware → edge/ML → decision → ledger → UI;
- `truth-tier-quality` — provenance-to-truth-badge mapping and Tier 2 no-backend/no-database tests;
- `secret-scan` — credentials, PII, queue DBs, frames, and unsafe artifacts.

No one disables, renames, or converts a failing required check into a warning to merge.

## 13. CODEOWNERS policy

Use only verified GitHub usernames; never guess a handle from a display name or email. `@Vortex-ParthAjmera` is the repository owner. Until each invitation is accepted and the exact account is verified, PARTH AJMERA remains a CODEOWNER fallback for the affected path.

The committed CODEOWNERS file must cover at least:

```text
/.github/                  repository owner + BHUMIKA SINGH RAWAT account
/DOCUMENTATION/            repository owner + BHUMIKA SINGH RAWAT account
/AGENTS.md                 repository owner + BHUMIKA SINGH RAWAT account
/README.md                 repository owner + BHUMIKA SINGH RAWAT account
/apps/web/                 YASHVARDHAN DOBHAL + relevant API/data owners
/packages/contracts/       repository owner + all boundary consumers
/packages/rules-engine/    AASHU JOSHI + repository owner
/firmware/esp32/           current ADITYA GitHub account + repository owner
/services/edge-gateway/    current ADITYA GitHub account + AASHU JOSHI + repository owner
/supabase/                 BHUMIKA SINGH RAWAT + AASHU JOSHI + repository owner
/tests/                    BHUMIKA SINGH RAWAT + repository owner
/scripts/demo/ml/          repository owner + ADITYA SILSWAL + AASHU JOSHI + BHUMIKA SINGH RAWAT accounts
```

Because KRISHNA PANWAR and ADITYA SILSWAL currently share one GitHub identity, CODEOWNERS cannot prove two-person review between them. Manual policy still requires the human owner name, local commit identity, evidence, and PARTH AJMERA's review.

## 14. Project board and labels

Columns:

```text
Backlog -> Ready -> In Progress -> In Review -> Blocked -> Done
```

Recommended labels:

- area: `web`, `api`, `edge`, `firmware`, `ml`, `database`, `qa`, `docs`;
- tier: `tier-1-real`, `tier-2-preview`, `tier-3-roadmap`;
- event-source: `hardware`, `recorded-hardware`, `simulated`, `seeded`;
- ml-source: `local-live`, `recorded-ml`, `simulated`, `seeded`;
- truth: `real`, `recorded`, `simulated`, `preview-seeded`;
- priority: `P0`, `P1`, `P2`, `P3`;
- state: `blocked`, `needs-decision`, `contract-change`, `demo-critical`;
- type: `feature`, `bug`, `test`, `chore`.

Only PARTH AJMERA changes scope/tier or moves a task out of the locked release.

## 15. Cursor, Freebuff, and coding-agent workflow

YASHVARDHAN DOBHAL has GitHub connected to Cursor. That connection does not choose a branch, authorize scope, or merge code.

Before every agent task:

1. verify the fixed branch and local identity;
2. confirm root `AGENTS.md` matches `DOCUMENTATION/AGENTS.md`;
3. provide exactly one issue/task using the root prompt template;
4. state requirement IDs, truth tier, allowed/forbidden paths, input fixture, and required proof;
5. instruct the agent to stop with `CHANGE_REQUEST` if the plan is insufficient;
6. inspect every changed file, stored provenance field, and UI truth badge;
7. run checks manually;
8. let a human commit, push, open the PR, and respond to review.

Never give an agent real `.env` values, service-role keys, gateway/device secrets, GitHub credentials, citizen PII, raw private camera frames, or permission to work directly on `integration`/`main`.

## 16. Secrets and identity safety

- Commit `.env.example` with safe placeholders only.
- Store hosted secrets in Vercel/Supabase/GitHub secret stores and local secrets in ignored files.
- Use different ESP32, edge, camera, cloud, and user credentials.
- Phone OTP and Google OAuth use only approved fictional demo identities; pre-created role accounts are the mandatory fallback.
- Never paste a token/password/cookie/camera URL with credentials into issues, PRs, screenshots, logs, serial output, or AI chats.
- If exposed: stop, revoke/rotate, preserve minimal private incident evidence, scan history/artifacts, and resume only after verification.
- A later deletion does not make a leaked secret safe.

## 17. End-of-task synchronization

After a PR is merged:

```bash
git switch team/<assigned-branch>
git fetch origin
git merge origin/integration
git push origin team/<assigned-branch>
```

Do not use `git rebase`, force push, destructive reset, or branch deletion. If history is confusing, stop and ask PARTH AJMERA.

## 18. Emergency procedure

A P0 does not remove governance:

1. open a P0 issue with reproduction, `eventId`, event source, ML/evidence source, UI truth badge, and owner;
2. preserve last known-good tag/deployment and evidence;
3. owning branch makes the smallest fix plus regression proof;
4. relevant owner and BHUMIKA SINGH RAWAT verify integrity/security effects;
5. PARTH AJMERA reviews and merge-commits to `integration`;
6. run the demo fallback if the safe fix cannot finish;
7. merge `integration -> main` only after the release gate;
8. all fixed branches sync `integration`.

## 19. Release records

Use `v0.1.0-rc1` for the QA-approved candidate and `v1.0.0-hackathon-demo` for the demonstrated/submitted build unless an approved release ADR changes them.

Each release records:

- completed Tier 1 journeys and requirement IDs;
- hardware and `LOCAL_LIVE` model actually demonstrated;
- automated/HIL/security/failure tests passed;
- Tier 2 previews included as frontend-only fixtures with no database row or feature API;
- fallbacks used (`RECORDED_HARDWARE`, `RECORDED_ML`, `SIMULATED`);
- known limitations and Tier 3 roadmap;
- commit SHA, contract/schema/rules/model/firmware/edge versions, deployment URL, and exact startup/reset procedure.
