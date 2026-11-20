import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, Note, P, Steps } from "../components/Prose";

/** Signing the app in to Misty Cloud or a server you run, and using a sign-in link. */
export default function Connect() {
  return (
    <DocPage title="Connect to a server">
      <P text="Your Misty account lives on a server. You can use Misty Cloud, which we run, or a server you run yourself." />

      <DocSection id="cloud" title="Use Misty Cloud">
        <P text="Misty Cloud is free, with nothing to set up." />
        <Steps
          items={[
            "Open Misty and select **Get started**, or **Sign in** if you already have an account.",
            "Select **Continue with Misty Cloud**.",
            "Enter your email and password, or continue with Google.",
          ]}
        />
        <P text="For more storage or bigger spaces, see [Plans and Boosts](/docs/plans)." />
      </DocSection>

      <DocSection id="own-server" title="Use your own server">
        <Steps
          items={[
            "Open Misty and select **Get started** or **Sign in**.",
            "Select **Use my own server**.",
            "Enter the **Server address**, such as `misty.example.com`, and select **Continue**.",
            "Sign in, or create an account. On a new server, the first account you create owns the server.",
          ]}
        />
        <P text="To run a server, see [Set up a server](/docs/self-hosting)." />
      </DocSection>

      <DocSection id="sign-in-link" title="Use a sign-in link">
        <P text="A sign-in link signs you in without a password. Use one if you forgot your password, or if the person who runs your server sent you one." />
        <Steps
          items={[
            "To get a link for Misty Cloud, go to [Sign in](/sign-in) on this site and ask for one.",
            "Open the link and choose to open it in Misty.",
            "Or, in the app, select **Use a sign-in link** and paste it.",
          ]}
        />
        <Note>
          A sign-in link works once and lasts seven days. Keep it private, like a password.
        </Note>
      </DocSection>

      <DocSection id="devices" title="Use Misty on another computer">
        <BulletList
          items={[
            "Install Misty and sign in with the same account.",
            "Your spaces live on the server, so you'll see the same ones on every computer.",
            "Engine sign-ins stay on each computer. Set up your engines again on the new one.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
