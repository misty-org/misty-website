# Misty legal launch checklist

What Misty needs around launch. Misty is free and open source (GNU AGPL-3.0-or-later), and Misty Cloud is a paid server Misty runs ($10/mo plus tax through Stripe). AI always runs on people's own models, called from their device; Misty hosts no model. It's practical, not legal advice.

The user chose to launch now and get the legal review afterwards, so `/terms` and `/privacy` are live without a Draft note. When a startup or consumer lawyer reviews them, have them focus on the Misty Cloud subscription terms (Terms §3: billing, tax, cancellation, refunds, the EU withdrawal right, failed payments, deletion after a subscription ends) and the arbitration clause (Terms §17).

Priority tags: **MUST** = before or at launch · **SHOULD** = within the first month · **LATER** = when users justify it.

Where things live:
- Legal pages: `src/pages/Legal/` (Terms, Privacy, License).
- Shared facts (operator, state, contact address, ages, date): `src/pages/Legal/legalInfo.ts`.
- Sign-up consent: `src/pages/Register/index.tsx`.

Someone who runs their own Misty server is the operator of that server and its data. Terms §4 says so, and the policies only cover this website and Misty Cloud.

---

## 0. Decided and filled in (October 31, 2026)

- [x] Operator: "Matthew Chen, an individual doing business as Misty". California law governs the Terms.
- [x] One contact address, `support@mistysys.com`, for help, privacy requests and takedowns. There is no `privacy@`.
- [x] The server host named in Privacy §6: OVHcloud.
- [x] Cancelling takes effect at the end of the paid month, with no partial refunds. EU, EEA and UK consumers keep the 14-day right to withdraw from a new subscription (Terms §3).
- [x] Failed payments: suspended after 14 days of retries. Data is deleted 30 days after the subscription ends, with a warning email first (Terms §3, Privacy §8).
- [x] Monthly searches and app actions reset on each customer's billing date (Terms §3, `/pricing`).
- [x] Minimum age: 13, or 16 in the EEA and UK (Terms §1, Privacy §13).
- [x] Stripe Tax is on, and prices say "plus tax where it applies" (`/pricing`, Terms §3, Privacy §2).
- [x] Forks: a changed version uses a different name and logo and may say it's based on Misty. The AGPL section 7(b) attribution term in `NOTICE` still applies (Terms §4, `/license`).
- [x] Sign in with ChatGPT and every model are the user's own and called from their device (Terms §5, Privacy §5).
- [x] Face grouping is removed, and so is everything about faces and biometric data.
- [x] PostHog is removed from the app, so the policies say there are no analytics or crash reports.
- [x] Draft notes removed.

## 1. Before anything else

- [ ] **MUST** Create the `support@mistysys.com` mailbox (forwarding to your inbox is fine), and actually read it.
- [ ] **MUST** Register a DMCA agent with the US Copyright Office (dmca.copyright.gov, $6 for 3 years) using `support@mistysys.com`. Without registration, the Terms §12 process doesn't get you safe harbor for files users share in Spaces.
- [ ] **SHOULD** File a DBA ("doing business as Misty") with your county, since you're a sole proprietor.
- [ ] **SHOULD** Form a single-member LLC (~$70–800/yr in California) when revenue justifies it. Then change `operatorDescription` to "Misty LLC, a California limited liability company". As a sole proprietor, every claim against Misty is a claim against your personal savings.
- [ ] **SHOULD** Get a small tech E&O / cyber liability policy now that Misty Cloud runs a server for paying people.
- [ ] **SHOULD** Have a lawyer review `/terms` and `/privacy` after launch, as decided.

---

## 2. Open source

- [ ] **MUST** Keep the AGPL `LICENSE` and `NOTICE` files at the root of github.com/misty-org/misty, and the copyright line matching `operatorName`.
- [ ] **SHOULD** Check that bundled third-party code is under licenses compatible with the AGPL (MIT, BSD, Apache-2.0, MPL-2.0, LGPL), and ship their notices with the app.

---

## 3. COPPA & minors

**Current setup:**
- Minimum age is **13+, or 16+ in the EEA/UK**. Under-18s need a parent's permission (Terms §1, Privacy §13).
- **No age prompt.** COPPA only applies if a service is *directed to children* or you have *actual knowledge* that a user is under 13. Misty is neither, so the Terms plus the sign-up checkbox are enough. Don't ask for a birthdate, because collecting it gives you actual knowledge.

Checklist:
- [ ] **MUST** If someone tells you a user is under 13 (support email, a profile, a parent), close the account and delete its data. That's the promise in Terms §1, so honor it every time.
- [ ] **MUST** Keep marketing aimed at adults. Marketing to kids makes the service "directed to children", and then COPPA applies regardless of your Terms.
- [ ] **LATER** Watch the state "age-appropriate design code" and app-store age-verification laws (CA, UT, TX, etc.) before marketing to teens.

---

## 4. Data deletion & privacy operations

**Current setup:**
- `POST /me/deletion` gives a 30-day recovery window, then purges the account.
- When a Misty Cloud subscription ends, billing calls the operator API's close with 30 days: the account is suspended, a notice goes out now and a warning 3 days before deletion, and then the same full purge runs. Paying again before then resumes it.
- Backups are kept for about 30 days.
- Export is available at `POST /me/export`.
- Privacy §8 describes all of this.

### Make the code match the policy
- [ ] **MUST** Verify that the purge removes everything it promises: Spaces the user owns alone with their notes, drawings and R2 files, the encrypted sync vault and favicon blobs, and AI conversations. Privacy §8 says "we delete your personal information or permanently anonymize it".
- [ ] **MUST** Check that a closed Cloud account is really read-only and exportable for its 30 days, and that the warning email goes out (Terms §3).
- [ ] **SHOULD** Keep the Models docs page (`/docs/models`) telling people to check their provider's training and retention settings.

### Handling requests
- [ ] **MUST** Answer privacy requests to `support@` within 30 days (GDPR) or 45 days (CCPA). Most can be pointed to the self-serve export and delete tools.
- [ ] **SHOULD** Keep a simple log of requests (date, what was asked, what you did). A spreadsheet is fine.
- [ ] **MUST** Check that Mailjet, Composio and Serper's data processing terms apply to Misty Cloud, and accept OVHcloud's. Cloudflare, Stripe and Google include theirs in their standard terms.
- [ ] **SHOULD** Write down a breach plan: who you notify and when. GDPR requires notifying the regulator within 72 hours, and US states require "without unreasonable delay".

---

## 5. Other protection that's cheap

- [ ] **SHOULD** Keep the truthful privacy wording in marketing copy. **Don't** say "we never track you", "zero-knowledge" or "fully encrypted". **Do** say "no ads, no selling data, no trackers", "no analytics" and "end-to-end encrypted sync". The FTC treats false privacy claims as deceptive practices.
- [ ] **LATER** Appoint an EU/UK GDPR Art. 27 representative (~€100–300/yr each) once you have meaningful EU/UK users.
- [ ] **LATER** Re-read the documents whenever you add a third-party service or start a new kind of data collection. Update the "Last updated" date in `legalInfo.ts` and email users about material changes 14 days ahead (Terms §19).

---

## Promises the documents make that depend on items above

| Promise | Where | Depends on |
|---|---|---|
| Deleted accounts are deleted or anonymized after 30 days | Privacy §8 | Purge verification (§4) |
| An ended subscription is read-only for 30 days, with a warning email, then deleted | Terms §3, Privacy §8 | Close and resume in the operator API, called by billing (§4) |
| Suspended after 14 days unpaid | Terms §3 | Stripe's retry schedule set to 14 days, then billing suspends |
| No analytics or crash reports | Privacy §1 | PostHog removed from the app |
