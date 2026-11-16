import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, DocTable, Note, P, Steps } from "../components/Prose";

const STARTERS = [
  ["Claude Code", "A Claude plan from Anthropic", "Your Claude plan"],
  ["Codex", "A ChatGPT account from OpenAI", "Your ChatGPT plan"],
  ["Antigravity", "A Google account", "Free"],
  ["OpenCode", "Nothing", "Free"],
];

/** The agents Misty runs, how to set one up, and what the default engine does. */
export default function ChooseAgent() {
  return (
    <DocPage title="Choose your agent">
      <P text="Misty doesn't have its own AI. It works with AI agents you already use, such as Claude Code and Codex. Each agent runs on your computer under your own sign-in." />
      <P text="Misty never charges for AI. You pay the agent's maker, if anything, on your own plan." />

      <DocSection id="agents" title="Agents you can use">
        <P text="These four are the easiest to start with:" />
        <DocTable columns={["Agent", "What you need", "What it costs"]} rows={STARTERS} />
        <P text="Misty also works with Gemini CLI, Qwen Code, Kimi CLI, Grok CLI, MiniMax Code, Qoder CLI, CodeBuddy, Pi, Oh My Pi, DeepSeek Harness and Hermes Agent." />
      </DocSection>

      <DocSection id="set-up" title="Set up an agent">
        <P text="Setup asks you to pick an agent the first time you sign in. To add another one later:" />
        <Steps
          items={[
            "Open **Agents** from the sidebar and go to **CLIs**.",
            "Find the agent you want.",
            "Select **Install**, then **Sign in to** the agent. Each agent signs in on its maker's own page.",
            "Wait until the agent shows **Ready**. If it doesn't, select **Check again**.",
          ]}
        />
      </DocSection>

      <DocSection id="default" title="Change your default engine">
        <P text="Your default engine is the agent Misty uses for its own work, such as the Lab, Tutor and reading web pages. It also starts new chats." />
        <Steps
          items={[
            "Open **Settings** and go to **Agents**, then **Engine**.",
            "Choose an agent under **Default engine**.",
          ]}
        />
        <Note>
          Not every agent can be the default. It needs to handle images, Misty's tools and web
          search. Agents that can't show **Can't run Misty's own work**.
        </Note>
      </DocSection>

      <DocSection id="more" title="Good to know">
        <BulletList
          items={[
            "Agent sign-ins stay on your computer. Misty's servers never see them.",
            "Each computer has its own sign-ins. Set up your agents on every computer you use.",
            "You can pick a different agent for any chat. See [Agent chats](/docs/chats).",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
