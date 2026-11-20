import { SUPPORT_EMAIL, DISCORD_URL } from "@/lib/site";
import { DocPage } from "../components/DocPage";
import { DocSection, P, Steps } from "../components/Prose";

/** Common problems, each with the fix. */
export default function Troubleshooting() {
  return (
    <DocPage title="Troubleshooting">
      <P text={`Can't find your problem here? Ask on [Discord](${DISCORD_URL}) or email ${SUPPORT_EMAIL}.`} />

      <DocSection id="agent-not-ready" title="My engine doesn't show Ready">
        <Steps
          items={[
            "Open **Agents** from the sidebar and go to **CLIs**.",
            "Make sure the engine is installed. If not, select **Install**.",
            "Sign in to the engine with its maker's account.",
            "Select **Check again**.",
          ]}
        />
      </DocSection>

      <DocSection id="connect-an-ai" title="A chat says Connect an AI to start">
        <P text="Misty doesn't have an engine it can use yet. Select **Set up an AI** and finish setting up an engine. See [Choose your engine](/docs/choose-agent)." />
      </DocSection>

      <DocSection id="waiting" title="A task in a space is waiting">
        <P text="Agents run on your computer. A task started from a space waits until one of your computers has Misty open. Open Misty and it starts." />
      </DocSection>

      <DocSection id="password" title="I forgot my password">
        <P text="Get a sign-in link from [Sign in](/sign-in), then open it in Misty. See [Use a sign-in link](/docs/connect#sign-in-link)." />
      </DocSection>

      <DocSection id="full" title="I can't add more files or people">
        <P text="Your account or the space has reached a limit. Nothing is lost, and everything still opens." />
        <Steps
          items={[
            "To free up room, delete files you no longer need.",
            "On Misty Cloud, get Misty+ for more storage, or boost the space to raise its limits. See [Plans and Boosts](/docs/plans).",
            "On your own server, ask whoever runs it.",
          ]}
        />
        <P text="[Space levels](/docs/limits) lists every limit." />
      </DocSection>

      <DocSection id="studio" title="The Studio doesn't show the room">
        <P text="Your computer's graphics can't draw the 3D room. Your agents still work as usual. Use them from **Agents** in the sidebar." />
      </DocSection>

      <DocSection id="setup-again" title="I want to run setup again">
        <Steps
          items={[
            "Open **Help**.",
            "Under **Getting started**, select **Run setup again**.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
