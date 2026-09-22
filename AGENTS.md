# 810 — Cursor Master Engineering Instructions

This is the current 810 application repository. Preserve the existing AI Studio UI and build the real product around it.

## Mission
810 ("eight-ten-tion") is an attention prediction and participation platform. Core loop:
CREATE → PARTICIPATE → SHARE/AMPLIFY → VERIFY → RESOLVE → REWARD

## First MVP
Prove one complete vertical slice: verified creator → objective attention market → admin approval → user YES/NO participation → share → server-side external metric verification → resolution → auditable reward/economic event.

First verification source: YouTube. Design adapters for TikTok, Instagram, Twitch, Kick, Spotify, Strava and WHOOP without hard-coding YouTube into the market engine.

Markets must use objective machine-verifiable metrics and explicit thresholds/deadlines.

## Non-negotiable rules
- Preserve the existing UI/design and working functionality unless explicitly told otherwise.
- Inspect actual code before changing it.
- Do not redesign, replace, or delete working UI.
- Do not invent requirements or make unrelated refactors.
- Plan significant changes first.
- Run tests/typecheck/lint after meaningful changes.
- Keep commits small and scoped.
- Never commit secrets or credentials.
- Client state is never authoritative for outcomes, balances, rewards, roles, verification or jurisdiction.

## Do not build yet
No sports betting, political markets, leverage, complex derivatives, unrestricted permissionless financial markets, DAO, 810 proprietary token, complex NFT mechanics, complex order books, decentralized settlement, real-money withdrawal infrastructure, or custodial wallets unless explicitly instructed.

## Architecture domains
Keep these concerns separated:
1. Market Engine
2. Attention Verification
3. Economic Engine
4. Rewards
5. Creator Economy
6. Brand Economy
7. Affiliate Attribution
8. Clipper Attribution
9. Jurisdiction
10. Admin/Compliance
11. AI Services
12. Security/Fraud

## Market lifecycle
DRAFT → SUBMITTED → APPROVED → OPEN → CLOSED → VERIFYING → RESOLVED → SETTLED
Also support CANCELLED and DISPUTED.

## Market model
Support as appropriate: id, title, description, question, creatorId, brandId, category, metric, threshold, eventId, verificationSource, openAt, closeAt, resolutionAt, status, economicMode, jurisdictionRules, rules, createdAt, updatedAt.

## Verification
Conceptual provider interface:
- getMetric()
- verifyEvent()
- resolveMarket()

External platform → server-side adapter → verification record → resolution engine → resolved market → reward/settlement strategy.

## Economic modes
Support architecture for FREE, GEMS, CASH_SETTLED, REWARD. MVP should not implement real-money settlement unless explicitly instructed. Gems are not a legal workaround; jurisdiction-specific rules must be configurable.

## Ledger
Do not use mutable shortcuts such as `user.balance += amount` for authoritative accounting. Use LedgerAccount, LedgerTransaction and LedgerEntry. Potential events include GEM_PURCHASE, GEM_GRANT, PARTICIPATION, REWARD, REFUND, CREATOR_REWARD, AFFILIATE_REWARD, CLIPPER_REWARD and PROMOTIONAL_REWARD.

## AI
Gemini/AI can assist with market wording, ambiguity/duplicate detection, moderation, validation, fraud signals, creator onboarding and support. AI must never independently move money, authorize withdrawals, alter ledger balances, override authoritative resolution, bypass jurisdiction or grant admin privileges.

## Roles
USER, CREATOR, BRAND, AFFILIATE, CLIPPER, ADMIN. Enforce roles server-side.

## Jurisdiction
User/jurisdiction → allowed economic modes → market → allowed participation. Architecture must allow disabling an economic mode without disabling 810.

## Preferred GCP direction
Cloud Run, Cloud SQL/PostgreSQL, Secret Manager, Pub/Sub where justified, Cloud Storage where needed, Vertex/Gemini for AI. Do not add infrastructure without a concrete reason.

## Security
Never trust client input for market outcome, balance, reward, verification result, role, jurisdiction or payout. Sensitive actions should create audit events.

## Development protocol
For every significant task:
1. Inspect relevant existing files.
2. State what changes and why.
3. Make the smallest safe implementation.
4. Run tests/typecheck/lint.
5. Review the diff for unintended changes.
6. Report what changed and what remains.

For money, custody, identity, security, jurisdiction or resolution changes: do not guess; flag ambiguity.

## Current first task
Before implementing features, perform a read-only audit of the actual repository and report: structure, framework, existing UI/routes/components, backend, database/storage, auth, APIs, current economic/mock logic, AI integrations, external APIs, deployment configuration, missing MVP pieces, security risks and recommended implementation sequence. Do not modify application code during the audit. Then stop and wait.

GTA VI can be a launch/cultural catalyst but must never be hard-coded into the core architecture.
