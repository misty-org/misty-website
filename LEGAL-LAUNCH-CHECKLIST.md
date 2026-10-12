# Misty legal & billing launch checklist

What Misty needs before taking paid B2C customers. It's practical, not legal advice. Before launch, pay a startup or consumer lawyer a flat fee (~$500–1,500) to review `/terms`, `/privacy` and `/refunds`. Have them focus on the arbitration clause (Terms §19) and face grouping (Privacy §8).

Priority tags: **MUST** = before the first paid customer · **SHOULD** = within the first month · **LATER** = when revenue or users justify it.

Where things live:
- Legal pages: `src/pages/Legal/` (Terms, Privacy, Refunds, License).
- Shared placeholders: `src/pages/Legal/legalInfo.ts`.
- Renewal disclosure: `src/pages/Pricing/components/RenewalDisclosure.tsx`.
- Sign-up consent: `src/pages/Register/index.tsx`.

---

## 0. Before anything else

- [ ] **MUST** Fill in `operatorName`, `operatorDescription` and `governingState` in `src/pages/Legal/legalInfo.ts`.
- [ ] **MUST** Create the `support@mistysys.com` and `privacy@mistysys.com` mailboxes (forwarding to your inbox is fine), and actually read them.
- [ ] **SHOULD** Form a single-member LLC (~$50–500/yr depending on state) and open a business bank account. Then change `operatorDescription` to "Misty LLC, a [STATE] limited liability company" and update Stripe's business details. As a sole proprietor, every claim against Misty is a claim against your personal savings. The LLC plus the liability cap in Terms §17 is your main shield.
  - If you stay a sole proprietor for now, file a DBA ("doing business as Misty") with your county or state.
- [ ] **SHOULD** Get a small tech E&O / cyber liability policy once revenue is real (often $500–1,500/yr).
- [ ] **MUST** Set the Terms URL and Privacy URL in Stripe → Settings → Public details. Stripe's consent checkbox (§1) needs them.

---

## 1. Auto-renewal & cancellation (FTC / ROSCA / California ARL)

**Federal status.** The FTC's "Click-to-Cancel" rule was vacated by the 8th Circuit in July 2025. Check whether the FTC has restarted rulemaking. The older federal law, ROSCA, still applies, and it requires three things:
- clear disclosure of all material terms before billing;
- express informed consent;
- a simple way to cancel.

**State law.** California's Automatic Renewal Law (as amended by AB 2863, effective July 1, 2025) is the strictest state law, and NY, MN, VA, CO and others are similar. If you comply with California, you are compliant almost everywhere.

### Done in this repo
- [x] A clear disclosure next to every paid button: price, billing frequency, renews until you cancel, how to cancel, and a link to the refund policy. Files: `RenewalDisclosure.tsx` (pricing cards) and `BillingPanel.tsx`.
- [x] The Terms (§9–10) and `/refunds` explain auto-renewal, trials, price changes and cancellation.
- [x] Sign-up requires ticking "I agree to the Terms of Service and Privacy Policy".

### Still to do
- [ ] **MUST: affirmative consent at checkout, recorded.** Do this in Stripe Checkout so Stripe keeps the consent record for you. California requires keeping it for 3 years, or 1 year after the subscription ends, whichever is longer. In `misty-billing/internal/payments/service.go` (checkout session params, ~line 237), add:
  ```go
  ConsentCollection: &stripe.CheckoutSessionConsentCollectionParams{
      TermsOfService: stripe.String("required"),
  },
  CustomText: &stripe.CheckoutSessionCustomTextParams{
      TermsOfServiceAcceptance: &stripe.CheckoutSessionCustomTextTermsOfServiceAcceptanceParams{
          Message: stripe.String(consentText), // see below
      },
  },
  ```
  **Checkbox text, trial checkout:**
  > I agree to the [Terms of Service](https://mistysys.com/terms) and authorize Misty to charge my card $8.00/month (plus applicable tax) automatically after my 14-day free trial ends on {trial_end_date}, and every month after that, until I cancel. I can cancel anytime in Account Settings → Billing. Payments are non-refundable except as described in the [Refund Policy](https://mistysys.com/refunds).

  **Checkbox text, no trial:**
  > I agree to the [Terms of Service](https://mistysys.com/terms) and authorize Misty to charge my card {price}/{month|year} (plus applicable tax) today and automatically every {month|year} until I cancel. I can cancel anytime in Account Settings → Billing. Payments are non-refundable except as described in the [Refund Policy](https://mistysys.com/refunds).

- [ ] **MUST: post-purchase acknowledgment email.** California requires it, and it must include the auto-renewal terms, how to cancel, and the trial details. Stripe's receipt alone doesn't cover the trial (no charge happens at trial start). Send this from Mailjet on the `checkout.session.completed` webhook (`misty-billing/.../events.go`).
  > **Subject:** Your Misty Pro {trial | subscription} is active
  >
  > Hi {name},
  >
  > Thanks for {starting your Misty Pro trial | subscribing to Misty Pro}. Here are your plan details for your records:
  >
  > - **Plan:** Misty Pro, billed {monthly | yearly}
  > - **Price:** {$8.00/month | $79.00/year} plus applicable tax
  > - **Free trial:** ends {trial_end_date}. You won't be charged before then. *(trial only)*
  > - **First charge:** {trial_end_date | today}, then every {month | year} on the same date
  > - **Automatic renewal:** your subscription renews automatically at the price above until you cancel.
  >
  > **How to cancel:** open Misty → Account Settings → Billing → Manage billing → Cancel plan, or go to https://mistysys.com/settings/billing. You can also reply to this email. If you cancel before {trial_end_date}, you won't be charged. Otherwise you keep Pro until the end of the period you paid for.
  >
  > Payments are non-refundable except as described in our Refund Policy (https://mistysys.com/refunds). Full terms: https://mistysys.com/terms.
  >
  > — Misty · support@mistysys.com

- [ ] **MUST: online cancellation as easy as sign-up.** In Stripe → Settings → Billing → Customer portal, turn on **Cancel subscriptions**. Choose "cancel at end of billing period", turn on a cancellation reason survey (optional), and do **not** add retention offers that block the cancel button.
- [ ] **SHOULD: cancellation confirmation email.** Send it on `customer.subscription.updated` when `cancel_at_period_end` flips to true. Once it ships, add "You'll receive an email confirming the cancellation" back to `/refunds §1`.
  > Your Misty Pro subscription is canceled. You'll keep Pro until {period_end}, then your account moves to Basic. Nothing is deleted. Changed your mind? Resubscribe anytime in Account Settings → Billing.
- [ ] **MUST: annual renewal reminder.** Stripe → Settings → Billing → Subscriptions and emails → **Send reminders about upcoming renewals** (7–30 days before; pick 15). The Terms (§9) promise price-change notice at least 30 days before; send that by hand from Mailjet when it happens.
- [ ] **SHOULD** Make sure the desktop app's own sign-up flow (and Google sign-in, if the app has it) shows the same "I agree to the Terms and Privacy Policy" line as the website.

---

## 2. Refunds & regional consumer law

The policy is live at `/refunds` and in Terms §10:
- No refunds by default.
- Exceptions: Misty clearly didn't work and you couldn't fix it; billing mistakes; anything the law requires; and your own discretion.
- Refund requests are due within 30 days of the charge.

**EU/EEA/UK/Swiss 14-day right of withdrawal.** For SaaS, the subscription counts legally as a *digital service*, not *digital content*. That means:
- A customer who asks for immediate access does **not** lose the right to withdraw. You may only keep a pro-rata amount for the days already used.
- The "waive your right to get instant access" checkbox you may have read about only fully removes the right for one-off digital content, such as downloads or e-books. For a subscription it only lets you charge pro-rata.
- `/refunds §4` takes the simplest compliant route: a **full refund on request within 14 days of the first paid purchase**. At $8 it isn't worth calculating pro-rata amounts.

Checklist:
- [ ] **MUST** (EU/UK checkout, if not using an MoR) Show this line in checkout (Stripe custom text above the pay button, or in the email). It keeps you covered if you ever want to charge pro-rata:
  > You can withdraw within 14 days of your first purchase for a refund. Because Misty starts right away, you agree that service begins immediately.
- [ ] **MUST** Respond to withdrawal emails and refund within 14 days, using Stripe → Payments → Refund.
- [ ] **SHOULD** Answer refund requests within a few days. A fast refund costs $8; a chargeback costs $15 in fees plus the $8, and enough of them gets your Stripe account flagged.
- [ ] **LATER** Australia, NZ, Brazil, Turkey, South Korea and others have their own consumer guarantees. The Terms' savings clause ("nothing limits your statutory rights") covers them. If you get a lot of customers in one country, check it specifically.

---

## 3. Tax & payment infrastructure

**Current state:** Stripe Billing with **no Stripe Tax** (`automatic_tax` is not set in `misty-billing`), so no tax is being collected, and **you personally owe it**.

| | Stripe (+ Stripe Tax) | Merchant of Record (Paddle, Lemon Squeezy, Polar, Stripe Managed Payments) |
|---|---|---|
| Who is the seller to the customer | You | The MoR (it resells your product) |
| Tax calculation | Stripe Tax calculates it (~0.5% per transaction) | MoR |
| **Tax registration & filing** | **You** register in each place and file returns: EU VAT OSS (non-Union scheme), UK VAT, plus each US state where you pass economic nexus (~$100k or 200 sales/yr) | **MoR** registers, collects, files and remits everywhere |
| Tax liability if wrong | **You** | **MoR** |
| EU/UK threshold for a non-EU seller of digital services | **None: VAT is due from the first sale** | MoR's problem |
| Refunds and chargebacks | You | MoR handles them (still ask them to apply your policy) |
| Fees | ~2.9% + 30¢ + 0.5% Tax + Billing 0.7% | ~5% + 50¢ all-in |
| Code change for Misty | Small (`automatic_tax: enabled` + collect address) | Stripe Managed Payments: small · Paddle: rewrite of `misty-billing` |

**Recommendation:** use a **Merchant of Record**. For a one-person company, the extra ~1.5% is far cheaper than registering for VAT in the EU and UK and tracking 45 US states.
- [ ] **MUST** Check whether **Stripe Managed Payments** (Stripe acting as the MoR) is available for your account. If it is, it's the smallest change from what you have.
- [ ] **MUST** If it isn't available, choose Paddle (or Polar or Lemon Squeezy) before launch, or block EU/UK sales until you do.
- [ ] **MUST** After switching to an MoR, update **Terms §9** and **Privacy §6** to name the MoR. For example: "Our order process is conducted by our online reseller [Paddle.com]. Paddle is the Merchant of Record for all our orders." Then delete the Stripe consent work from §1 if the MoR checkout has its own consent step.
- [ ] **SHOULD** Even with an MoR, report the MoR payouts as business income on your own tax return (Schedule C as a sole proprietor or single-member LLC).

---

## 4. COPPA & minors

**Current setup:**
- Minimum age is **13+, or 16+ in the EEA/UK**. Under-18s need a parent's permission, and only adults can buy paid plans (Terms §1, Privacy §15).
- **No age prompt.** COPPA only applies if a service is *directed to children* or you have *actual knowledge* that a user is under 13. Misty is neither, so the Terms plus the sign-up checkbox are enough. Don't ask for a birthdate, because collecting it gives you actual knowledge.

Checklist:
- [ ] **MUST** If someone tells you a user is under 13 (support email, a profile, a parent), close the account and delete its data. That's the promise in Terms §1, so honor it every time.
- [ ] **MUST** Keep marketing aimed at adults: no cartoon mascots aimed at kids, no "great for school kids" copy, no ads on kids' channels. Marketing to kids makes the service "directed to children", and then COPPA applies regardless of your Terms.
- [ ] **LATER** You can raise the minimum age at any time. **Going below 13 requires full COPPA**: verifiable parental consent, a parental dashboard and data limits for kids. For an AI browser that's not realistic for one person, so don't promise it.
- [ ] **LATER** Watch the state "age-appropriate design code" and app-store age-verification laws (CA, UT, TX, etc.). Most target app stores and social media, but check before marketing to teens.

---

## 5. Free trial / freemium: dunning, trial emails, data on downgrade

**Current setup:**
- 14-day Pro trial with a card required. It converts to paid automatically at trial end.
- A `past_due` account loses Pro **immediately** (`misty-billing/.../events.go:139`).
- **No billing emails are sent.**

### Stripe dashboard toggles (no code). MUST before launch.
In **Settings → Billing → Subscriptions and emails**:
- [ ] Send **trial will end** reminders (7 days before). The Terms (§9) and `/refunds` promise this, and Visa/Mastercard rules require a reminder before a trial converts.
- [ ] Send **upcoming renewal** reminders for annual plans.
- [ ] Send **receipts** for successful payments and refunds.
- [ ] Send **failed payment** emails with a link to update the card.
- [ ] Send **expiring card** reminders.
- [ ] Turn on **Smart Retries**: retry for 1–2 weeks, then **cancel the subscription** (not "leave past_due"). This matches `/refunds §5`.

### Code
- [ ] **SHOULD** Add a **7-day grace period** in `misty-billing/.../events.go:139` so paid features stay on while `past_due` and Smart Retries runs. Cutting off a paying user because of one bank glitch causes churn and support emails.
- [ ] **SHOULD** Use your own Mailjet copy if you'd rather not use Stripe's emails. Suggested texts:

**Trial ending, sent 7 days before (or 3 days for trials of 7 days or less):**
> **Subject:** Your Misty Pro trial ends on {date}
>
> Your free trial ends on {date}. Unless you cancel before then, we'll charge {$8.00/month} plus applicable tax to your card ending {last4}, and every {month} after until you cancel. To cancel: Account Settings → Billing → Manage billing. No charge if you cancel before {date}.

**Payment failed (attempts 1–3):**
> **Subject:** We couldn't process your Misty payment
>
> Your payment of {amount} for Misty Pro didn't go through. We'll retry on {next_retry_date}. Update your card in Account Settings → Billing to keep Pro. If we can't collect payment by {final_date}, your account moves to the free Basic plan. Nothing is deleted.

**Final notice / downgraded:**
> **Subject:** Your Misty account is now on Basic
>
> We couldn't collect payment, so your Pro subscription was canceled and your account is now on Basic. Your content is safe. If you're over Basic's limits, content beyond them is read-only until you free up space or resubscribe.

### Data on downgrade or cancellation
This is in Terms §11. Content over the new plan's limit becomes read-only. You *may* delete it after 90 days over the limit, but only with 30 days' email notice. There's no deletion code today, and none is needed. If you ever build it:
- [ ] **LATER** Send the 30-day warning email first, include an export link, and only then delete.

---

## 6. Data deletion & privacy operations

**Current setup:**
- `POST /me/deletion` gives a 30-day recovery window, then anonymizes the account.
- Backups are kept for about 30 days.
- Export is available at `POST /me/export`.
- Privacy §10 describes all of this.

### Make the code match the policy
- [ ] **MUST: verify that the purge removes everything it promises.** The purge in `misty/server/.../account_lifecycle_record_account_deletion_failure.go:155-206` renames the user row, but it isn't confirmed that it deletes:
  - Spaces the user owns alone, with their notes, drawings and R2 files;
  - the user's encrypted sync vault and favicon blobs;
  - AI conversations;
  - face templates.

  Privacy §10 says "we delete your personal information or permanently anonymize it". Content tied to a deleted, anonymous user is *probably* fine for the user's personal data, but leftover sole-owned Spaces and files are not.
- [ ] **MUST: face grouping / "People" (biometric data).** It currently runs whenever `VISION_PROCESSOR_URL` is set, with **no consent step**. Illinois BIPA allows lawsuits for $1,000–$5,000 *per person*, which is the biggest legal risk found. Pick one before launch:
  - (a) Turn it off in production (unset `VISION_PROCESSOR_URL`) **and delete the face-grouping section (Privacy §8)**; or
  - (b) Add an explicit opt-in, off by default, that shows the Privacy §8 text and records consent. Delete the templates when the feature is turned off, when the media is deleted or the account is deleted, and in any case within 3 years.
- [ ] **MUST** Check that PostHog in `misty/src/telemetry/client.ts` doesn't write cookies or localStorage before the user opts in (use `persistence: 'memory'` or don't initialize until consent). Otherwise the "no cookie banner" position (Privacy §9) breaks in the web app.
- [ ] **MUST** Check that each AI provider account has data training turned off and the strictest retention available. OpenAI API and Vercel AI Gateway are fine by default. For Google Gemini, use the **paid** API tier, because free-tier Gemini data may be used for training. Privacy §5 says providers don't train on API data by default.
- [ ] **MUST** Fill in "Our server hosting provider" in Privacy §6 with the VPS company's name.

### Handling requests
- [ ] **MUST** Answer privacy@ requests within 30 days (GDPR) or 45 days (CCPA). Most can be pointed to the self-serve export and delete tools.
- [ ] **SHOULD** Keep a simple log of requests (date, what was asked, what you did). A spreadsheet is fine.
- [ ] **SHOULD** Sign or accept the Data Processing Agreements from Cloudflare, Stripe, Mailjet, PostHog, OpenAI, Vercel and Google. Most are click-through in each dashboard.
- [ ] **SHOULD** Write down a breach plan: who you notify and when. GDPR requires notifying the regulator within 72 hours, and US states require "without unreasonable delay".

---

## 7. Other protection that's cheap

- [ ] **MUST** Register a DMCA agent with the US Copyright Office (dmca.copyright.gov, $6 for 3 years) using `support@mistysys.com`. Without registration, the Terms §14 process doesn't get you safe harbor for files users share in Spaces.
- [ ] **SHOULD** Keep the truthful privacy wording in marketing copy. **Don't** say "we never track you", "zero-knowledge" or "fully encrypted". **Do** say "no ads, no selling data, no trackers", "end-to-end encrypted sync", and "analytics are off unless you turn them on". The FTC treats false privacy claims as deceptive practices.
- [ ] **LATER** Appoint an EU/UK GDPR Art. 27 representative (~€100–300/yr each) once you have meaningful EU/UK users.
- [ ] **LATER** Re-read the documents whenever you add a third-party service, start a new kind of data collection, or change pricing. Update the "Last updated" date in `legalInfo.ts` and email users about material changes 14 days ahead (Terms §21).

---

## Promises the documents make that depend on items above

Have these in place before launch, or soften the wording:

| Promise | Where | Depends on |
|---|---|---|
| "We will email you before your trial ends" | Terms §9, Refunds §2 | Stripe trial reminder toggle (§5) |
| "We and Stripe will retry it and email you" | Terms §9, Refunds §5 | Smart Retries + failed-payment emails (§5) |
| "Subscription is canceled, account moves to Basic" after failed retries | Refunds §5 | Smart Retries final action = cancel (§5) |
| Face grouping is opt-in | Privacy §8 | Opt-in gate or feature disabled (§6) |
| Deleted accounts are deleted or anonymized after 30 days | Privacy §10 | Purge verification (§6) |
| No non-essential cookies | Privacy §9 | PostHog persistence check (§6) |
| AI providers don't train on API data by default | Privacy §5 | Paid Gemini tier (§6) |
