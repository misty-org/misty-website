import { CLOUD_HOST, SITE_URL } from "@/lib/site";
import {
  BulletList,
  CodeBlock,
  DocSection,
  DocTable,
  Note,
  Paragraphs,
  Steps,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";

const CHOICES = [
  [
    "Misty Cloud",
    "The setup link from your welcome email, or the server address and setup key in it.",
    "Sync, Spaces, agents and every tool, on Misty Cloud.",
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
    <DocPage
      title="Connect the app"
      description="The first time Misty opens, a short setup wizard asks where your server is, then helps you pick your models. You can also just browse."
    >
      <DocSection id="choices" title="The three choices">
        <DocTable
          columns={["Choice", "What you enter", "What you get"]}
          rows={CHOICES}
        />
      </DocSection>

      <DocSection id="cloud" title="Misty Cloud">
        <Paragraphs
          items={[
            "Paying for Misty Cloud creates your account and emails you a setup link; there's no separate sign-up. The link goes to [mistysys.com/setup](/setup) and carries the server address and setup key after the `#`, the part of a link a browser never sends. The page reads them in your browser, clears them from the address bar, and offers Open in Misty, which starts the setup wizard with both filled in. It also shows them to copy, and the email lists them on their own too.",
          ]}
        />
        <Steps
          items={[
            "Install Misty from [Download](/download).",
            "Open the setup link in your welcome email and choose Open in Misty. Misty opens its setup wizard with your server and key filled in. You can also choose Misty Cloud in the wizard and paste the link, or type the server address and setup key.",
            "Choose Continue. The key signs you in once, and this computer becomes your first device.",
            "Set a password when the wizard asks. It opens your encrypted sync, and you sign in with it on your other computers. Sync stays off until it's set.",
            "Pick your models in the last step ([Models](/docs/models)). Check the agent model to make sure it can call tools and read screenshots.",
          ]}
        />
        <CodeBlock
          label="What the welcome email contains"
          code={`${SITE_URL}/setup#server=${CLOUD_HOST}&key=misty_setup_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Server: ${CLOUD_HOST}
Setup key: misty_setup_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`}
        />
        <Note>
          A setup key works once and lasts seven days. Treat it like a password.
          If your key was used or has expired, get a new one at{" "}
          <a href="/sign-in" className="underline underline-offset-4">
            mistysys.com/sign-in
          </a>
          ; it replaces any earlier unused key.
        </Note>
      </DocSection>

      <DocSection id="own-server" title="My own server">
        <Steps
          items={[
            "Choose My own server and enter its address, such as `misty.example.com`.",
            "Sign in. On a fresh server, create the first account, which owns the server. On a server you were invited to, create your account with the invited email, or sign in with Misty or with Google.",
            "If the person who runs the server sent you a sign-in link, open it instead. It goes to the same [setup page](/setup) with your server's address, and works just like Misty Cloud's.",
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
            "Each computer you sign in on becomes one of your devices. Misty Cloud allows five; your own server has no limit.",
            "Each device makes its own key when it's added, and your synced data is encrypted with a key only your devices hold, so the server can't read it.",
            "Model keys and settings belong to each device, so pick your models on each computer.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
