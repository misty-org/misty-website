import {
  BulletList,
  DocSection,
  DocTable,
  Note,
  P,
  Paragraphs,
  Steps,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";

const CHOICES = [
  [
    "Misty Cloud",
    "Your Misty account's email and password, or Continue with Google.",
    "Spaces with your people, on Misty Pro.",
  ],
  [
    "Self-hosted",
    "Your server's address, then the usual sign-in.",
    "Spaces with your people, on a server you run.",
  ],
  [
    "Only this computer",
    "Nothing.",
    "Chat with your AI on this computer. No Spaces to share.",
  ],
];

/** The setup wizard the app opens with, for each kind of server. */
export default function Connect() {
  return (
    <DocPage title="Connect the app">
      <P text="The first time Misty opens, it asks where your account lives, which AI to start with and which apps agents can use." />

      <DocSection id="choices" title="The three choices">
        <DocTable
          columns={["Choice", "What you enter", "What you get"]}
          rows={CHOICES}
        />
      </DocSection>

      <DocSection id="cloud" title="Misty Cloud (Misty Pro)">
        <Steps
          items={[
            "Make a Misty account on this site and subscribe on [Pricing](/pricing).",
            "Install Misty from [Download](/download).",
            "Choose Misty Cloud in the setup wizard and sign in with your Misty account. This computer becomes your first device.",
            "Pick an AI to start with, such as Claude Code or Codex, and sign in to it. Then choose which apps agents can use ([Models](/docs/models)).",
          ]}
        />
        <Note>
          Forgot your password? Get a sign-in link at{" "}
          <a href="/sign-in" className="underline underline-offset-4">
            mistysys.com/sign-in
          </a>
          . It works once and lasts seven days, so treat it like a password. Open
          it and choose Open in Misty, or choose Use a sign-in link in the setup
          wizard and paste it.
        </Note>
      </DocSection>

      <DocSection id="own-server" title="Self-hosted">
        <Steps
          items={[
            "Choose Self-hosted (or Use my own server) and enter its address, such as `misty.example.com`.",
            "Sign in. On a fresh server, create the first account, which owns the server. On a server you were invited to, create your account with the invited email, or sign in with Misty or with Google.",
            "If the person who runs the server sent you a sign-in link, open it instead. It goes to the [setup page](/setup) with your server's address and offers Open in Misty, or you can choose Use a sign-in link in the setup wizard and paste it.",
            "Pick an AI to start with, such as Claude Code or Codex, and sign in to it. Then choose which apps agents can use.",
          ]}
        />
      </DocSection>

      <DocSection id="only-this-computer" title="Only this computer">
        <Paragraphs
          items={[
            "Only this computer uses Misty with no account. Your chats and settings stay here, and you can add a server later in Settings.",
          ]}
        />
      </DocSection>

      <DocSection id="devices" title="Your other computers">
        <BulletList
          items={[
            "Each computer you sign in on becomes one of your devices, and makes its own key when it's added.",
            "Your Spaces live on the server, so every computer you sign in on sees the same ones.",
            "Model keys, AI sign-ins and settings belong to each device, so set up your AI on each computer.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
