> **PLAN & STRUCTURE LOCK — v1.0:** This approved scope, stack, repository structure, contracts, ownership map, and delivery plan must not be changed by contributors or AI agents. Work only inside the assigned paths. If a change is necessary, stop and submit a `CHANGE_REQUEST`; only PARTH AJMERA may approve it, followed by an ADR and team notification.

# SGV 2.0 Team and GitHub Workflow

Status: Approved collaboration baseline  
Workflow version: 1.0  
Repository name: `sgv-2-smart-waste-ecosystem`  
Default branch: `main`  
Integration branch: `integration`

## 1. Repository description

Use this GitHub description:

> ESP32-powered smart waste collection with offline edge sync, live municipal operations, and auditable citizen credits, verified penalties, and disputes.

Recommended visibility is public for hackathon review if team/university rules allow it and only simulated data is used. If the repository must be private, PARTH AJMERA must confirm that the selected GitHub plan supports the required protection settings.

## 2. Roles and decision rights

| Member | GitHub-linked email | Role | Fixed branch | Final responsibility |
|---|---|---|---|---|
| PARTH AJMERA | `ajmeraparth.official@gmail.com` | Product Owner, Repository Maintainer, Integration Lead | `team/parth-ajmera-governance` | scope, contracts, issue assignment, PR approval, milestone/release merges |
| YASHVARDHAN DOBHAL | `yashvardhandobhal944@gmail.com` | Web UI Owner | `team/yashvardhan-dobhal-web-ui` | citizen/operator/admin web experience |
| AASHU JOSHI | `aashujoshisbps@gmail.com` | Cloud API and Rules Owner | `team/aashu-joshi-cloud-api` | API, auth, use cases, compliance/reward logic |
| KRISHNA PANWAR | `krishnapanwar464@gmail.com` | Hardware and Firmware Owner | `team/krishna-panwar-esp32` | physical prototype, calibration, ESP32 firmware |
| ADITYA SILSWAL | `adiisilswal@gmail.com` | Edge Gateway Owner | `team/aditya-silswal-edge-gateway` | FastAPI, local durability, device auth, cloud sync |
| BHUMIKA SINGH RAWAT | `bhumika282007@gmail.com` | Data, QA, and Release Owner | `team/bhumika-singh-rawat-data-qa` | schema/RLS, CI, tests, release verification |

PARTH AJMERA approves and merges team pull requests. BHUMIKA SINGH RAWAT reviews PARTH AJMERA's own PRs so no contributor self-approves.

The only optional ML work uses PARTH AJMERA's existing branch and `scripts/demo/ml/**`. It may begin only after G4; both AASHU JOSHI and BHUMIKA SINGH RAWAT must approve its PR. No seventh branch or ownership exception is created.

These addresses were supplied as GitHub identities. A public repository makes committed email addresses visible, so PARTH AJMERA should confirm the team accepts that exposure or replace them with GitHub-provided no-reply commit addresses before the first public push.

## 3. Branch topology

~~~text
main                         protected, always demo-ready
└── integration              protected, tested team integration
    ├── team/parth-ajmera-governance
    ├── team/yashvardhan-dobhal-web-ui
    ├── team/aashu-joshi-cloud-api
    ├── team/krishna-panwar-esp32
    ├── team/aditya-silswal-edge-gateway
    └── team/bhumika-singh-rawat-data-qa
~~~

Rules:

1. Each person commits only to their assigned `team/*` branch.
2. Each implementation PR targets `integration`.
3. Only milestone/release PRs target `main`.
4. No direct push to `integration` or `main`.
5. The six team branches are persistent for the hackathon.
6. Use normal merge commits into `integration` so persistent branch history remains connected.
7. Never squash-merge a reused persistent team branch.
8. Never rebase or force-push a shared/persistent branch.
9. Never delete the six team branches during the event.
10. Emergency work still uses the owning team branch and a P0 issue; it does not bypass review.

## 4. One-time repository creation

PARTH AJMERA performs this setup from the approved initial documentation/scaffold:

~~~bash
git init
git branch -M main
git add .
git commit -m "chore(repo): initialize SGV 2.0 monorepo"
git remote add origin <approved-repository-url>
git push -u origin main

git switch -c integration
git push -u origin integration

git switch -c team/parth-ajmera-governance integration
git push -u origin team/parth-ajmera-governance

git switch integration
git switch -c team/yashvardhan-dobhal-web-ui
git push -u origin team/yashvardhan-dobhal-web-ui

git switch integration
git switch -c team/aashu-joshi-cloud-api
git push -u origin team/aashu-joshi-cloud-api

git switch integration
git switch -c team/krishna-panwar-esp32
git push -u origin team/krishna-panwar-esp32

git switch integration
git switch -c team/aditya-silswal-edge-gateway
git push -u origin team/aditya-silswal-edge-gateway

git switch integration
git switch -c team/bhumika-singh-rawat-data-qa
git push -u origin team/bhumika-singh-rawat-data-qa
~~~

Before running these commands, PARTH AJMERA must confirm that no existing Git history would be overwritten and replace `<approved-repository-url>` with the actual remote.

## 5. Collaborator setup

Each member:

1. accepts the GitHub invitation;
2. clones the repository;
3. fetches all remote branches;
4. switches to the exact assigned branch;
5. verifies the branch before every coding session;
6. installs dependencies using the documented setup;
7. copies `.env.example` to the approved local environment file and receives secrets through a private channel;
8. reads root `AGENTS.md` and their issue before asking an AI agent to edit.

Each member configures identity **inside this repository** (omit `--global`) using the exact name/email from the table:

~~~bash
git config user.name "FULL NAME FROM TABLE"
git config user.email "GITHUB-LINKED EMAIL FROM TABLE"
git config --get user.name
git config --get user.email
~~~

Example for YASHVARDHAN DOBHAL:

~~~bash
git clone <approved-repository-url>
cd sgv-2-smart-waste-ecosystem
git fetch origin
git switch --track origin/team/yashvardhan-dobhal-web-ui
git branch --show-current
~~~

The last command must print `team/yashvardhan-dobhal-web-ui`. The same rule applies to every member's branch.

## 6. Start-of-task workflow

Before editing:

~~~bash
git switch team/<assigned-branch>
git status
git fetch origin
git merge origin/integration
git status
~~~

Then:

1. read the assigned issue and root `AGENTS.md`;
2. confirm allowed and forbidden paths;
3. identify the authoritative contract fixture;
4. run the current module's baseline checks;
5. work on one issue only;
6. open a Draft PR after the first meaningful commit.

If merging `origin/integration` creates a conflict outside the member's owned paths, stop and ask PARTH AJMERA plus the affected owner. Do not guess.

## 7. Commits

Use Conventional Commits:

~~~text
<type>(<scope>): <imperative summary>
~~~

Allowed types:

- `feat` — new approved behavior;
- `fix` — defect correction;
- `test` — tests only;
- `docs` — approved documentation;
- `refactor` — behavior-preserving change;
- `chore` — build/configuration maintenance.

Examples:

~~~text
feat(edge): persist collection messages before acknowledgement
feat(firmware): add calibrated moisture sensor reading
fix(credits): prevent duplicate reward for replayed event
test(rls): isolate household collection history
docs(plan): record approved gateway port decision
~~~

Commit rules:

- one coherent purpose per commit;
- no generated build output, secrets, logs, database files, or editor settings;
- no “final”, “changes”, “update”, or AI-generated meaningless summaries;
- do not mix formatting across unrelated files;
- run applicable checks before push;
- humans review the diff before an AI-authored commit is pushed.

## 8. Pull-request size and scope

One PR implements one issue or tightly coupled task ID.

Recommended limits:

- fewer than 400 changed source lines, excluding generated lockfiles, migrations, and approved fixtures;
- one owned module whenever possible;
- no unrelated refactor;
- no new dependency unless the issue explicitly approves it;
- no contract/schema/structure change hidden inside a feature PR.

Open a Draft PR early so integration risks are visible. Mark it ready only after local checks and self-review.

## 9. Required PR body

~~~markdown
## Task
Implements: <issue/task ID>

## Outcome
<What now works, in one or two sentences>

## Allowed paths
- <paths from issue>

## Contract and schema
- Contract version: 1.0
- Schema/migration impact: none | <approved detail>

## Verification
- [ ] Applicable format/lint checks
- [ ] Typecheck/compile
- [ ] Unit tests
- [ ] Integration/contract test where required
- [ ] Manual acceptance scenario

## Evidence
<UI screenshots, API response, test output, ESP32 serial log, or short video>

## Governance
- [ ] I did not change scope, stack, folder structure, ownership, or milestones.
- [ ] I changed only assigned paths.
- [ ] No secret, real PII, or generated artifact is committed.
- [ ] Root AGENTS.md was followed.

## Risks and reviewer focus
<Anything uncertain; do not hide it>

## Optional ML evidence (complete only when applicable)
- Source label: MANUAL_COLAB | RECORDED_ML
- Core G4 evidence:
- Model/dependency license decision:
- Synthetic-input and no-PII/secrets check:
- Deterministic RECORDED_ML fallback:
- Proof of no device-contract/rules/collection-state/credit/review/penalty side effect:
~~~

## 10. Review and merge rules

### Team branch to integration

1. Author syncs `origin/integration` into their team branch.
2. Author resolves conflicts only within owned paths.
3. Required CI checks pass.
4. PARTH AJMERA confirms issue scope, path ownership, acceptance evidence, and contract compliance.
5. Relevant consumer/owner reviews a boundary change.
6. All conversations are resolved.
7. PARTH AJMERA selects **Create a merge commit**.
8. Author and other members merge updated `origin/integration` back into their team branches.

### Integration to main

1. BHUMIKA SINGH RAWAT completes the release checklist.
2. No P0 issue is open.
3. Required checks pass against the current `main`.
4. PARTH AJMERA performs the demo smoke test.
5. PARTH AJMERA merges with a normal merge commit and creates the approved release tag.

Never use **Squash and merge** or **Rebase and merge** with the persistent team branches.

## 11. Required branch protection

Apply protection to both `main` and `integration`:

- require a pull request before merging;
- require at least one approval;
- require review from CODEOWNERS;
- dismiss stale approvals after code changes, or require approval of the latest reviewable push;
- require status checks to pass;
- require the branch to be up to date;
- require all conversations to be resolved;
- block force pushes;
- block branch deletion;
- disable bypass where the repository plan permits;
- do not allow direct pushes;
- do not enable auto-merge during the event.

Required checks should be stable names:

- `web-quality` — format, lint, typecheck, unit test, build;
- `edge-quality` — Ruff/format, Pytest, contract/outbox tests;
- `firmware-build` — PlatformIO clean compile and fixture compatibility;
- `database-quality` — migration reset, SQL/RLS tests, seed validation;
- `contract-quality` — schema/OpenAPI and cross-language fixtures;
- `integration-smoke` — golden critical-path smoke test when affected;
- `secret-scan` — committed credential detection.

Do not make a failing check optional and do not rename a required check merely to merge.

## 12. CODEOWNERS baseline

Replace placeholders with exact GitHub usernames before committing:

~~~text
# Protect repository governance
/.github/CODEOWNERS                         @parth-ajmera-handle
/.github/                                  @parth-ajmera-handle @bhumika-singh-rawat-handle
/DOCUMENTAION/                             @parth-ajmera-handle @bhumika-singh-rawat-handle
/AGENTS.md                                 @parth-ajmera-handle @bhumika-singh-rawat-handle
/README.md                                 @parth-ajmera-handle @bhumika-singh-rawat-handle
/package.json                              @parth-ajmera-handle
/package-lock.json                         @parth-ajmera-handle
/.env.example                              @parth-ajmera-handle @bhumika-singh-rawat-handle

# Web UI
/apps/web/src/app/(citizen)/               @yashvardhan-dobhal-handle @parth-ajmera-handle
/apps/web/src/app/(operator)/              @yashvardhan-dobhal-handle @parth-ajmera-handle
/apps/web/src/app/(admin)/                 @yashvardhan-dobhal-handle @parth-ajmera-handle
/apps/web/src/components/                  @yashvardhan-dobhal-handle @parth-ajmera-handle
/apps/web/src/lib/api-client/              @yashvardhan-dobhal-handle @aashu-joshi-handle @parth-ajmera-handle

# Cloud API and rules
/apps/web/src/app/api/v1/                  @aashu-joshi-handle @parth-ajmera-handle
/apps/web/src/lib/auth/                    @aashu-joshi-handle @bhumika-singh-rawat-handle @parth-ajmera-handle
/apps/web/src/lib/domain/                  @aashu-joshi-handle @parth-ajmera-handle
/apps/web/src/lib/supabase/                @aashu-joshi-handle @bhumika-singh-rawat-handle @parth-ajmera-handle
/packages/rules-engine/                    @aashu-joshi-handle @parth-ajmera-handle

# Device and edge
/firmware/esp32/                           @krishna-panwar-handle @aditya-silswal-handle @parth-ajmera-handle
/services/edge-gateway/                    @aditya-silswal-handle @aashu-joshi-handle @parth-ajmera-handle
/packages/contracts/                       @parth-ajmera-handle

# Data and QA
/supabase/                                 @bhumika-singh-rawat-handle @aashu-joshi-handle @parth-ajmera-handle
/tests/                                    @bhumika-singh-rawat-handle @parth-ajmera-handle
/.github/workflows/                        @bhumika-singh-rawat-handle @parth-ajmera-handle
/scripts/demo/ml/                          @parth-ajmera-handle @aashu-joshi-handle @bhumika-singh-rawat-handle
~~~

Because any listed code owner may satisfy a code-owner requirement, team policy still requires PARTH AJMERA's approval. For PARTH AJMERA-authored changes, BHUMIKA SINGH RAWAT provides the independent approval.

For `scripts/demo/ml/**`, CODEOWNERS alone is insufficient: the PR requires separate approvals from both AASHU JOSHI and BHUMIKA SINGH RAWAT.

## 13. GitHub Project board

Use these columns:

~~~text
Backlog → Ready → In Progress → In Review → Blocked → Done
~~~

Every issue must include:

- task ID and milestone;
- single owner;
- fixed branch;
- allowed paths;
- forbidden paths;
- dependency issues;
- input contract/fixture;
- Given/When/Then acceptance criteria;
- required tests/evidence;
- demo step;
- priority `P0` through `P3`.

Recommended labels:

- area: `web`, `api`, `edge`, `firmware`, `database`, `qa`, `docs`;
- priority: `P0`, `P1`, `P2`, `P3`;
- state: `blocked`, `needs-decision`, `contract-change`, `demo-critical`;
- type: `feature`, `bug`, `test`, `chore`.
- optional demonstration source: exact labels `MANUAL_COLAB` and `RECORDED_ML`, plus `optional-ml`.

Only PARTH AJMERA changes scope or moves a task out of the frozen MVP.

### Optional ML PR gate

An `optional-ml` tool PR is accepted only after the G4 core issue and required CI are green. It touches `scripts/demo/ml/**`; separately scoped owner PRs may add only the observation API/table/UI frozen in documents 05, 06, 20, and 21. Use synthetic input, expose no PII/secrets/tokens, and preserve one-message device sync v1 plus all rules/collection-state/credit/review/penalty behavior. Record the model, weights/data provenance, and license decision; if Ultralytics is used, resolve its default AGPL-3.0 versus Enterprise terms using the official [license page](https://www.ultralytics.com/license). Treat uncertainty as `NO-GO`. Because Colab resources are not guaranteed and shared notebooks expose their contents, follow the [Google Colab FAQ](https://research.google.com/colaboratory/faq.html), sanitize outputs, and attach a deterministic fallback. The visible source must remain `MANUAL_COLAB` or `RECORDED_ML`. If late or failing, close/defer the PR; the core demo never waits.

## 14. Conflict handling

1. Never resolve a conflict by accepting all of one side.
2. The owner of each affected path explains the intended behavior.
3. Contract conflicts require PARTH AJMERA plus KRISHNA PANWAR, ADITYA SILSWAL, and AASHU JOSHI as applicable.
4. Migration conflicts require BHUMIKA SINGH RAWAT; already-applied migration files are never rewritten.
5. Shared root/lockfile conflicts require PARTH AJMERA.
6. If a PR touches another owner's path accidentally, remove that part or split/reassign the work.
7. Record an ADR only for a genuinely approved architectural decision, not for ordinary merge resolution.

Prohibited conflict “solutions” include deleting another member's code, regenerating the entire scaffold, moving folders, replacing dependencies, or asking an AI to choose a side without owner input.

## 15. YASHVARDHAN DOBHAL's Cursor workflow

YASHVARDHAN DOBHAL has GitHub connected to Cursor. That does not authorize Cursor to select scope or merge code.

Before each Cursor task:

1. verify the checked-out branch is `team/yashvardhan-dobhal-web-ui`;
2. ensure root `AGENTS.md` is present and active;
3. give Cursor exactly one GitHub issue using the task prompt in `AGENTS.md`;
4. state allowed/forbidden paths explicitly;
5. require Cursor to stop with `CHANGE_REQUEST` if the frozen plan is insufficient;
6. inspect every changed file in the diff;
7. run checks manually;
8. let a human commit/push and open the PR.

Cursor must not receive real `.env` values, Supabase service keys, gateway secrets, citizen data, or permission to work on `integration`/`main`.

The same process applies to Freebuff and every other coding agent used by the team.

## 16. Secrets and environment handling

- Commit `.env.example` with names and safe placeholders only.
- Keep local secrets in ignored environment files.
- Store hosted secrets in Vercel/Supabase/GitHub secret stores.
- Use separate ESP32, edge gateway, cloud, and user credentials.
- Never paste secrets into issues, PRs, screenshots, logs, AI chats, or serial output.
- If a key is exposed, stop, rotate/revoke it, document the incident privately, and scan history. Deleting it in a later commit is insufficient.
- Never use real citizen PII in the prototype.

## 17. End-of-task sync

After PARTH AJMERA merges a team PR:

~~~bash
git switch team/<assigned-branch>
git fetch origin
git merge origin/integration
git push origin team/<assigned-branch>
~~~

Then close/advance the issue only after the merged result is visible and CI on `integration` remains green.

Do not use:

~~~bash
git rebase
git push --force
git push --force-with-lease
git reset --hard
git checkout -- <shared-file>
~~~

If local history is confusing, stop and ask PARTH AJMERA. Do not “clean it up” destructively.

## 18. Emergency procedure

A P0 does not remove governance:

1. open a P0 issue with reproduction and owner;
2. protect the last known-good tag/deployment;
3. owner fixes the smallest possible change on their persistent branch;
4. add a regression test or concrete hardware reproduction;
5. run required checks;
6. PARTH AJMERA reviews and merge-commits to `integration`;
7. BHUMIKA SINGH RAWAT verifies;
8. PARTH AJMERA merges `integration` to `main` and tags the hotfix;
9. all team branches sync `integration`.

If the safe fix cannot be completed, use the documented demo fallback instead of bypassing checks.

## 19. Release records

At minimum create:

- `v0.1.0-rc1` at the QA-approved release candidate;
- `v1.0.0-hackathon-demo` for the submitted/demoed build.

Each release notes:

- completed user journeys;
- hardware actually demonstrated;
- tests and failure scenarios passed;
- known limitations;
- exact setup/demo procedure;
- whether any approved fallback was used.
