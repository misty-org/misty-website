import { DocPage } from "../components/DocPage";
import { DocSection, Note, P, Steps } from "../components/Prose";

/** From download to a first agent task shared with a teammate, in order. */
export default function Quickstart() {
  return (
    <DocPage title="Quickstart">
      <P text="This guide takes you from installing Misty to working with your first agent and teammate. It takes about ten minutes." />

      <DocSection id="before" title="Before you start">
        <P text="You'll need an AI agent you can sign in to. Claude Code works with a Claude plan, and Codex works with a ChatGPT account. Antigravity is free with a Google account, and OpenCode needs no account at all." />
      </DocSection>

      <DocSection id="install" title="1. Install Misty">
        <Steps
          items={[
            "Download Misty for your computer from [Download](/download).",
            "Open the app. You'll see **Welcome to Misty**.",
          ]}
        />
      </DocSection>

      <DocSection id="account" title="2. Create your account">
        <Steps
          items={[
            "Select **Get started**.",
            "Select **Continue with Misty Cloud**. To use a server you run yourself, select **Use my own server** instead. See [Connect to a server](/docs/connect).",
            "Enter your email and a password, or continue with Google.",
          ]}
        />
      </DocSection>

      <DocSection id="agent" title="3. Set up your agent">
        <P text="After you sign in, Misty walks you through setup." />
        <Steps
          items={[
            "Read **How Misty works** and select **Continue**.",
            "Under **Pick your default engine**, choose an agent. Select **Install** or **Sign in** next to it until it shows **Ready**.",
            "Select **Continue**.",
            "Under **Which apps should agents use?**, sign in to any apps you want your agents to use, such as Gmail or Slack. You can skip this for now.",
            "Select **Start using Misty**.",
          ]}
        />
        <P text="[Choose your agent](/docs/choose-agent) explains each agent and what it costs." />
      </DocSection>

      <DocSection id="chat" title="4. Give your agent a task">
        <Steps
          items={[
            "Select **New** in the sidebar.",
            "Type what you want done in the message box, such as \"Summarize the files in my Documents folder\".",
            "Press Enter. Your agent starts working, and you can follow each step.",
          ]}
        />
        <P text="[Agent chats](/docs/chats) covers attaching files, approving plans and stopping a run." />
      </DocSection>

      <DocSection id="space" title="5. Invite your team">
        <P text="Spaces are where you work with other people. Your account comes with one." />
        <Steps
          items={[
            "Open **Space** from the sidebar.",
            "Open the **⋯** menu and choose **People**.",
            "Select **Invite member**, enter your teammate's email and select **Invite**.",
            "Select **Copy** and send them the link. Once they join, you can chat, share files and see each other's agents at work.",
          ]}
        />
        <Note>
          Agents run on your computer, so Misty needs to be open for them to work. A task
          someone starts for you in a space waits until one of your computers is online.
        </Note>
      </DocSection>

      <DocSection id="next" title="Next steps">
        <P text="Read about [Spaces](/docs/spaces), connect apps and skills on the [Agents page](/docs/agents), or meet your agents in the [Studio](/docs/studio)." />
      </DocSection>
    </DocPage>
  );
}
