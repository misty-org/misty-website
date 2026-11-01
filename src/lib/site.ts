export const SITE_URL = "https://mistysys.com";
export const REPO_URL = "https://github.com/misty-org/misty";
export const RELEASES_URL = `${REPO_URL}/releases`;

/** Misty Cloud's server, its `MISTY_HOSTNAME`. Its API is `https://api.mistysys.com/v1`. */
export const CLOUD_HOST = "api.mistysys.com";

/** misty-billing, which answers checkout with a redirect to Stripe Checkout. */
export const BILLING_URL = "https://billing.mistysys.com";

/** "Get Misty Cloud": a Stripe Checkout session for the Cloud plan. */
export const CLOUD_CHECKOUT_URL = `${BILLING_URL}/checkout?plan=cloud`;

/** The same checkout with one storage add-on. */
export const CLOUD_CHECKOUT_STORAGE_URL = `${CLOUD_CHECKOUT_URL}&storage=1`;

/**
 * Stripe's hosted customer-portal login, where subscribers change or cancel
 * their plan and update their card. TODO(before launch): paste the login link
 * from Stripe → Settings → Billing → Customer portal.
 */
export const CUSTOMER_PORTAL_URL = "https://billing.stripe.com/p/login/REPLACE_ME";

/** The one support address, for help, privacy requests and takedowns. */
export const SUPPORT_EMAIL = "support@mistysys.com";
