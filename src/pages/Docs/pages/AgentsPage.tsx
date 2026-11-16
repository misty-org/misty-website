import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, Note, P, Steps } from "../components/Prose";

/** The Agents window: your agents, the AI tools they run on, and the apps, skills and plugins they use. */
export default function AgentsPage() {
  return (
    <DocPage title="Agents page">
      <P text="The Agents page is where you manage your agents and what they can use. Open it by selecting **Agents** in the sidebar." />
      <P text="It has three groups of pages:" />
      <BulletList
        items={[
          "**Agents**: your agents and personas.",
          "**Engines**: the AI tools your agents run on, such as Claude Code and Codex. Go to **CLIs** to install them.",
          "**Tools**: plugins, skills, prompts, MCP servers and apps your agents can use.",
        ]}
      />

      <DocSection id="new-agent" title="Create an agent">
        <Steps
          items={[
            "Go to **Your agents**.",
            "Under **New agent**, choose an **Engine**, such as Claude Code.",
            "Enter a **Name** and choose the **Folder** it works in.",
            "Select **Create agent**.",
          ]}
        />
        <P text="To change an agent's name, role or instructions later, open it and select **Save changes** when you're done." />
      </DocSection>

      <DocSection id="apps" title="Connect an app">
        <P text="Apps let your agents work in tools like Notion, Linear or Figma. You sign in on the app maker's own page. Misty never sees your password." />
        <Steps
          items={[
            "Go to **Apps**.",
            "Search under **Find an app**.",
            "Select **Connect** next to the app.",
            "Sign in to the app in your browser, then come back to Misty.",
          ]}
        />
        <BulletList
          items={[
            "Every agent can use the apps you connect.",
            "To disconnect, select the check mark next to the app and choose **Disconnect**.",
            "If you use Claude Code, apps you connected on claude.ai appear under **Claude Code apps**.",
          ]}
        />
        <Note>
          Your agent asks before it acts in an app. See [Approve actions](/docs/chats#approve).
        </Note>
      </DocSection>

      <DocSection id="skills" title="Add a skill">
        <P text="A skill teaches an agent how to do a specific kind of task." />
        <Steps
          items={[
            "Go to **Plugins** and choose an agent's engine.",
            "Open **Skills** and select **Browse skills**.",
            "Select **Install** next to the skill you want.",
          ]}
        />
        <P text="To add a skill from a folder on your computer, go to **Skills** and select **Import local skill**." />
      </DocSection>

      <DocSection id="plugins" title="Install a plugin">
        <P text="A plugin can add several skills and apps at once." />
        <Steps
          items={[
            "Go to **Plugins** and choose an engine.",
            "Find the plugin. Filter by **Installed** to see what you already have.",
            "Select **Install**. Some plugins ask you to sign in to an app too.",
          ]}
        />
        <P text="To remove a plugin, open its menu and choose **Remove**. To add plugins from another source, select **Add a marketplace**." />
      </DocSection>
    </DocPage>
  );
}
