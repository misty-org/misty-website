import type { IntegrationDoc } from "./types";

export const googleEnv: IntegrationDoc = {
  slug: "google",
  file: "google.env",
  service: "Google",
  summary: "Lets people sign in to your server with their Google account.",
  purpose: [
    "People can sign in to your server with Google instead of an email and password. Google only confirms who they are: the server keeps an ordinary Misty account for them and never stores their Google tokens. An existing account is never linked to a Google sign-in just because the email address matches.",
  ],
  account: ["A Google Cloud project with an OAuth client. It's free."],
  youSet: [
    {
      name: "GOOGLE_CLIENT_ID",
      about: "Your OAuth client's ID.",
      howTo:
        "Google Auth Platform → Clients, after you create a Web application client.",
    },
    {
      name: "GOOGLE_CLIENT_SECRET",
      about: "Your OAuth client's secret. It stays on the server.",
      howTo: "Shown when you create the client, and on the client's page.",
    },
  ],
  sections: [
    {
      id: "redirect-uri",
      title: "The redirect URI",
      paragraphs: [
        "Add `https://MISTY_HOSTNAME/v1/auth/google/callback` as an authorized redirect URI on the OAuth client. For `MISTY_HOSTNAME=misty.example.com`, it's `https://misty.example.com/v1/auth/google/callback`. A missing `/v1` or a trailing slash makes Google refuse the sign-in.",
      ],
    },
  ],
  steps: [
    "Go to [console.cloud.google.com](https://console.cloud.google.com) and create a project for your server.",
    "Open Google Auth Platform → Branding. Give the app a name, a support email and your domain as an authorized domain.",
    "Under Audience, choose External. While the app is in testing, only the test users you add can sign in; publish it to let anyone sign in.",
    "Under Data Access, add the `openid`, `email` and `profile` scopes.",
    "Under Clients, create a client of type Web application. Add your redirect URI under Authorized redirect URIs.",
    "Copy the client ID and client secret into `server/.env/google.env`.",
  ],
  example: `GOOGLE_CLIENT_ID=<your client ID>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your client secret>`,
};
