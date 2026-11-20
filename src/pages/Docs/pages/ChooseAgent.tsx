import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, DocTable, Note, P, Steps } from "../components/Prose";

const STARTERS = [
  ["Claude Code", "A Claude plan from Anthropic", "Your Claude plan"],
  ["Codex", "A ChatGPT account from OpenAI", "Your ChatGPT plan"],
  ["Antigravity", "A Google account", "Free"],
  ["OpenCode", "Nothing", "Free"],
];

/** The engines agents run on, how to set one up, and what the default engine does. */
export default function ChooseAgent() {
  return (
    <DocPage title="Choose your engine">
      <P text="Misty doesn't have its own AI. Your agents run on an engine you already use, such as Claude Code or Codex. Each engine runs on your computer under your own sign-in." />
      <P text="Misty never charges for AI. You pay the engine's maker, if anything, on your own plan." />

      <DocSection id="agents" title="Engines you can use">
        <P text="These four are the easiest to start with:" />
        <DocTable columns={["Engine", "What you need", "What it costs"]} rows={STARTERS} />
        <P text="Misty also works with Gemini CLI, Qwen Code, Kimi CLI, Grok CLI, MiniMax Code, Qoder CLI, CodeBuddy, Pi, Oh My Pi, DeepSeek Harness and Hermes Agent." />
      </DocSection>

      <DocSection id="set-up" title="Set up an engine">
        <P text="Setup asks you to pick an engine the first time you sign in. To add another one later:" />
        <Steps
          items={[
            "Open **Agents** from the sidebar and go to **CLIs**.",
            "Find the engine you want.",
            "Select **Install**, then **Sign in to** the engine. Each engine signs in on its maker's own page.",
            "Wait until the engine shows **Ready**. If it doesn't, select **Check again**.",
          ]}
        />
      </DocSection>

      <DocSection id="default" title="Change your default engine">
        <P text="Your default engine is the one Misty uses for its own work, such as the Lab, Tutor and reading web pages. It also starts new chats." />
        <Steps
          items={[
            "Open **Settings** and go to **Agents**, then **Engine**.",
            "Choose an engine under **Default engine**.",
          ]}
        />
        <Note>
          Not every engine can be the default. It needs to handle images, Misty's tools and web
          search. Engines that can't show **Can't run Misty's own work**.
        </Note>
      </DocSection>

      <DocSection id="more" title="Good to know">
        <BulletList
          items={[
            "Engine sign-ins stay on your computer. Misty's servers never see them.",
            "Each computer has its own sign-ins. Set up your engines on every computer you use.",
            "You can pick a different agent, on any engine, for any chat. See [Agent chats](/docs/chats).",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
