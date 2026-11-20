import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, Note, P, Steps } from "../components/Prose";

/** The Studio: a 3D room where your agents work at desks, and where you hire new ones. */
export default function Studio() {
  return (
    <DocPage title="Studio">
      <P text="The Studio is a 3D room where your agents work. Each agent has a desk. Agents type while they work and wave at the door when they need you." />
      <P text="You can see your teammates' agents there too, while those teammates are in the same space." />

      <DocSection id="open" title="Open the Studio">
        <Steps
          items={[
            "In the sidebar, select **More**.",
            "Select **Studio**.",
          ]}
        />
        <P text="To keep it in the sidebar, right-click **More**, choose **Reorder pins** and pin **Studio**. You can also search for Studio with Cmd+K (Ctrl+K on Windows and Linux)." />
      </DocSection>

      <DocSection id="team" title="See what your agents are doing">
        <P text="The toolbar at the bottom of the room has three modes. **Studio** (key 1) shows the **Team** panel, which sorts your agents into:" />
        <BulletList
          items={[
            "**Needs you**: waiting for your answer or approval.",
            "**Working**: running a task now.",
            "**Finished**: done, with results to review.",
            "**Free**: ready for a new task.",
          ]}
        />
        <P text="Requests waiting for you are listed under **Requests**." />
      </DocSection>

      <DocSection id="talk" title="Talk to an agent">
        <Steps
          items={[
            "Select an agent at its desk.",
            "Type a message and select **Send**.",
            "To keep going in a full chat, select **Open chat**.",
          ]}
        />
        <P text="You can also type in the box at the bottom of the room. Start with @ and the agent's name, then say what you'd like." />
      </DocSection>

      <DocSection id="hire" title="Hire an agent">
        <P text="Hiring adds a new agent with its own desk." />
        <Steps
          items={[
            "Select **Hire** in the toolbar (key 2).",
            "Choose its engine, such as Claude Code or Codex. Engines you haven't installed are locked. See [Choose your engine](/docs/choose-agent).",
            "Enter a **Name**, a **Role** and the **Folder** it works in.",
            "Select **Hire**.",
          ]}
        />
        <P text="To change an agent's name, role or look later, select it and choose **Customize**." />
      </DocSection>

      <DocSection id="build" title="Arrange the room">
        <Steps
          items={[
            "Select **Build** in the toolbar (key 3).",
            "Change the **Room size**, add **Furniture**, or set **Whose desk** each desk is.",
            "Use **Turn** and **Remove** to move things. **Reset layout** starts over.",
          ]}
        />
      </DocSection>

      <DocSection id="walk" title="Walk around">
        <BulletList
          items={[
            "Press V to switch between the overview camera and walking.",
            "While walking, use W, A, S and D to move, and drag to look around.",
            "Near an agent, press E to talk to it. Near a free desk, press E to hire.",
          ]}
        />
        <Note>
          If your computer's graphics can't draw the room, the Studio shows a message instead.
          Your agents still work as usual on the Agents page.
        </Note>
      </DocSection>
    </DocPage>
  );
}
