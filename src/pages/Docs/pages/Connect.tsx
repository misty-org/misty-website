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
    "Misty Pro",
    "Your Misty account's email and password, or Continue with Google.",
    "Sync, Spaces, agents and every tool, on Misty Pro.",
  ],
  [
    "My own server",
    "Your server's address, then the usual sign-in.",
    "Everything, on a server you run.",
  ],
  [
    "Just browse",
    "Nothing.",
    "Misty as a browser. Everything stays on this computer.",
  ],
];

/** The setup wizard the app opens with, for each kind of server. */
export default function Connect() {
  return (
    <DocPage title="Connect the app">
      <P text="The first time Misty opens, a short setup wizard asks where your server is, then helps you pick your models. You can also just browse." />

      <DocSection id="choices" title="The three choices">
        <DocTable
          columns={["Choice", "What you enter", "What you get"]}
          rows={CHOICES}
        />
      </DocSection>

      <DocSection id="cloud" title="Misty Pro">
        <Steps
          items={[
            "Make a Misty account on this site and subscribe on [Pricing](/pricing).",
            "Install Misty from [Download](/download).",
            "Choose Misty Pro in the setup wizard and sign in with your Misty account. This computer becomes your first device.",
            "Pick your models in the last step ([Models](/docs/models)). Check the agent model to make sure it can call tools and read screenshots.",
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

      <DocSection id="own-server" title="My own server">
        <Steps
          items={[
            "Choose My own server and enter its address, such as `misty.example.com`.",
            "Sign in. On a fresh server, create the first account, which owns the server. On a server you were invited to, create your account with the invited email, or sign in with Misty or with Google.",
            "If the person who runs the server sent you a sign-in link, open it instead. It goes to the [setup page](/setup) with your server's address and offers Open in Misty, or you can choose Use a sign-in link in the setup wizard and paste it.",
            "Pick your models in the last step.",
          ]}
        />
      </DocSection>

      <DocSection id="just-browse" title="Just browse">
        <Paragraphs
          items={[
            "Just browse leaves Misty as a browser with no account. Your tabs, history and settings stay on this computer, and you can add a server later in Settings.",
          ]}
        />
      </DocSection>

      <DocSection id="devices" title="Your other computers">
        <BulletList
          items={[
            "Each computer you sign in on becomes one of your devices. Misty Pro allows five; your own server has no limit.",
            "Each device makes its own key when it's added, and your synced data is encrypted with a key only your devices hold, so the server can't read it.",
            "Model keys and settings belong to each device, so pick your models on each computer.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
