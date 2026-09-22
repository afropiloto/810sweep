# 810 — Cursor Master Engineering Instructions

## Mission

You are the engineering agent for 810 ("eight-ten-tion").

The repository is the source of truth for implementation. The existing AI Studio UI/design direction is approved. Preserve it unless explicitly instructed otherwise.

810 is an attention prediction and participation platform: creators/brands create measurable attention challenges; users participate YES/NO; users share/amplify; an external platform metric is verified; the market resolves; eligible rewards/economics are recorded; creators and distributors can receive attribution/economics.

Core loop:

CREATE → PARTICIPATE → SHARE/AMPLIFY → VERIFY → RESOLVE → REWARD

## Current repository state

This repository contains the current application moved from Google AI Studio. Treat the existing application/UI as the starting point.

Before implementing anything:
- inspect the actual repository
- identify the framework, routes, components, services, data model and deployment configuration
- preserve the existing visual design and working functionality
- do not assume backend infrastructure exists simply because UI screens exist

## Non-negotiable engineering rules

1. Do not redesign or replace the existing approved UI.
2. Do not delete working functionality without explicit approval.
3. Do not invent product requirements.
4. Do not make unrelated refactors.
5. Inspect existing code before changing it.
6. For significant work, plan first, then implement.
7. Run tests/type checks/lint after meaningful changes.
8. Keep commits small and logically scoped.
9. Never commit secrets, API keys, service-account credentials, or .env files containing credentials.
10. Never trust client-side authoritative state.

## Product boundaries for MVP

Build the smallest real system that proves:

Creator → creates market → admin approval → user participates → sharing → external attention verification → resolution → reward/economic event → audit.

First market type:

"Will this specific piece of content reach X measurable attention metric by Y deadline?"

Example:

"Will this YouTube video reach 1,000,000 views by 23:59 UTC on October 1?"

Markets must use objective, machine-verifiable metrics. Avoid subjective wording such as "go viral."

First external verification source: YouTube.

Design adapters for future:
- TikTok
- Instagram
- Twitch
- Kick
- Spotify
- Strava
- WHOOP

Do not hard-code YouTube throughout the system.

## Do not build yet

Unless explicitly instructed, do not implement:
- sports betting
- political markets
- leverage
- complex derivatives
- unrestricted permissionless financial markets
- DAO governance
- an 810 proprietary token
- complex NFT mechanics
- complex order books
- decentralised settlement
- real-money withdrawal infrastructure
- custodial wallets

These can be future capabilities.

## Domain architecture

Keep these domains separated:

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

The Market Engine must not depend directly on a particular payment or currency system.

## Market lifecycle

Use a server-authoritative lifecycle:

DRAFT
→ SUBMITTED
→ APPROVED
→ OPEN
→ CLOSED
→ VERIFYING
→ RESOLVED
→ SETTLED

Also support CANCELLED and DISPUTED where needed.

A client must never be able to set the outcome, resolution, balance, reward, or settlement state directly.

## Market model

A market should support, as appropriate:

- id
- title
- description
- question
- creatorId
- brandId
- category
- metric
- threshold
- eventId
- verificationSource
- openAt
- closeAt
- resolutionAt
- status
- economicMode
- jurisdictionRules
- rules
- createdAt
- updatedAt

Do not duplicate authoritative data unnecessarily.

## Attention verification

Create a provider interface conceptually supporting:

- getMetric()
- verifyEvent()
- resolveMarket()

The browser is never authoritative for an external metric.

Expected flow:

External platform
→ server-side adapter
→ verification record
→ resolution engine
→ resolved market
→ reward/settlement strategy

For future high-value markets, support multiple sources and human escalation.

## Economic architecture

Support configurable economic modes:

- FREE
- GEMS
- CASH_SETTLED
- REWARD

The MVP should not implement real-money settlement unless explicitly instructed.

Do not design Gems as an automatic legal workaround. Jurisdiction-specific rules must be configurable and reviewed separately.

The architecture must allow future monetary settlement without rewriting the market engine.

Conceptual flow:

Market
→ EconomicMode
→ ParticipationRules
→ Outcome
→ SettlementStrategy

## Ledger

Never use a mutable shortcut such as:

user.balance += amount

for authoritative accounting.

Use a ledger-oriented model:

- LedgerAccount
- LedgerTransaction
- LedgerEntry

Potential transaction types:

- GEM_PURCHASE
- GEM_GRANT
- PARTICIPATION
- REWARD
- REFUND
- CREATOR_REWARD
- AFFILIATE_REWARD
- CLIPPER_REWARD
- PROMOTIONAL_REWARD

Every economic movement must be auditable.

## AI

Gemini/AI may assist with:

- market creation
- market wording
- ambiguity detection
- duplicate detection
- moderation
- validation
- fraud signals
- creator onboarding
- support

AI must never independently:
- move money
- authorize withdrawals
- alter ledger balances
- override authoritative resolution
- bypass jurisdiction controls
- grant admin privileges

Treat AI output as untrusted input until validated by deterministic server-side rules.

## Users and roles

Minimum roles:

- USER
- CREATOR
- BRAND
- AFFILIATE
- CLIPPER
- ADMIN

Roles must be enforced server-side.

Creators and brands are first-class entities. Affiliate and clipper attribution must be auditable and protected against self-referral, duplicate attribution, replay and obvious fraud.

## Jurisdiction

Do not hard-code a universal economic model.

Conceptual rule:

User/Jurisdiction → allowed economic modes → market → allowed participation

The system must be capable of disabling a specific economic mode without disabling the entire 810 product.

## Security

Never trust client input for:
- market outcome
- balance
- reward
- verification result
- role
- jurisdiction
- payout
- creator economics

Secrets must remain server-side.

Sensitive actions should produce audit events.

## Preferred GCP direction

The production architecture should be compatible with:

- Cloud Run
- Cloud SQL/PostgreSQL
- Secret Manager
- Pub/Sub where asynchronous processing is justified
- Cloud Storage where required
- Vertex/Gemini for AI

Do not introduce infrastructure without a concrete reason.

## API principles

Use clear domain APIs. Conceptual examples:

POST /markets
GET /markets
GET /markets/:id
POST /markets/:id/participate
POST /markets/:id/share

POST /creators
GET /creators/:id
POST /creators/:id/verify

GET /attention/events/:id
GET /attention/events/:id/metric

GET /ledger/account
GET /ledger/transactions

Administrative operations must not be exposed as public endpoints.

## MVP definition of done

The first production-capable vertical slice is complete when:

1. A creator can be verified.
2. A creator can create an objective attention market.
3. An admin can approve it.
4. A user can see it.
5. A user can participate YES/NO.
6. A user can share it.
7. 810 can retrieve/record the external metric server-side.
8. The verification engine can determine the objective result.
9. The market can close and resolve.
10. The result is immutable/auditable.
11. An eligible reward/economic event can be recorded.
12. Creator and user can see the result.
13. Admin can audit the lifecycle.

## Development protocol

For every significant task:

1. Inspect relevant existing files.
2. State what will change and why.
3. Produce a concise implementation plan.
4. Implement the smallest safe change.
5. Run tests/typecheck/lint as applicable.
6. Fix errors.
7. Review the diff for unintended changes.
8. Report what changed and what remains.

For money, settlement, custody, identity, security, jurisdiction, or resolution changes: do not guess. Flag ambiguity and request clarification.

## First task

Do NOT build the entire platform immediately.

First perform a read-only repository audit.

Report:

A. Current repository structure
B. Existing application/framework
C. Existing UI
D. Existing backend
E. Existing database/storage
F. Existing authentication
G. Existing APIs
H. Existing Gems/points/economic logic
I. Existing AI integration
J. Existing deployment configuration
K. Missing MVP components
L. Security risks
M. Recommended implementation sequence

Do not modify application code during the audit.

After the audit, stop and wait for the next implementation instruction.

## GTA VI

GTA VI is an initial launch/cultural catalyst, not the core architecture. Never hard-code GTA VI into the platform. The generic attention-market engine must support it as one category of market.

Potential examples include trailer views, creator-content views, streams, follower milestones and other objectively verifiable attention events.
