import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, Note, P, Steps } from "../components/Prose";

/** Spaces: making one, inviting people, what's inside, bringing agents, privacy and leaving. */
export default function Spaces() {
  return (
    <DocPage title="Spaces">
      <P text="A Space is a shared place for a team or project. Everyone in it shares one chat, docs, drawings, tasks, a calendar and files. Their agents can work there too." />
      <P text="Your account comes with a space of your own. You can make as many more as you like." />

      <DocSection id="create" title="Create a space">
        <Steps
          items={[
            "Open **Space** from the sidebar.",
            "Select the space's name at the top, then choose **New Space**.",
            "Enter a **Name**, such as \"Design team\".",
            "Optionally, add people under **Invite people** by email.",
            "Select **Create Space**.",
          ]}
        />
      </DocSection>

      <DocSection id="switch" title="Switch spaces">
        <P text="Select the space's name at the top of the space page and choose another space. The current one has a check mark." />
      </DocSection>

      <DocSection id="invite" title="Invite people">
        <Steps
          items={[
            "In the space, open the **⋯** menu and choose **People**.",
            "Select **Invite member**.",
            "Enter their **Email address** and select **Invite**.",
            "Select **Copy** and send them the invitation link.",
          ]}
        />
        <BulletList
          items={[
            "Invitations expire after seven days. To send a fresh one, find it under **Pending invitations** and select **New link**.",
            "The person opens the link and selects **Join Space**. If they're new to Misty, they create an account first.",
          ]}
        />
      </DocSection>

      <DocSection id="inside" title="What's in a space">
        <P text="The space's home page links to each part:" />
        <BulletList
          items={[
            "**Chat**: the **Everyone** channel for the whole space, plus channels and direct messages.",
            "**Docs**: documents and drawings you edit together, live.",
            "**Lab**: notebooks for learning and research.",
            "**Planner**: tasks in **To do**, **In progress** and **Done**. You can assign a task to a person or an agent.",
            "**Calendar**: events for the space.",
            "**Media**: the space's photos, videos and files, with a photo and video editor you and your agents work in.",
          ]}
        />
        <P text="To add something, select **New** on the space's home page and choose **Doc**, **Drawing** or **Upload file**." />
      </DocSection>

      <DocSection id="agents" title="Work with agents in a space">
        <P text="Your agents can join a space and work alongside your team." />
        <Steps
          items={[
            "In the space's chat, type @ and the name of one of your agents.",
            "Write what you'd like it to do and send the message.",
            "The agent replies in the chat when it's done.",
          ]}
        />
        <BulletList
          items={[
            "You can mention up to three agents in one message.",
            "You can only mention your own agents. To hand work to a teammate's agent, select **Give to** on a handoff card.",
            "To add an agent without mentioning it, open **People** and select **Bring an agent**.",
          ]}
        />
        <Note>
          Your agents run on your computer. A task started in a space waits until one of your
          computers has Misty open.
        </Note>
      </DocSection>

      <DocSection id="private" title="Keep something private">
        <P text="New items are shared with everyone in the space. To keep one to yourself, open its **⋯** menu and turn on **Private**. Only you and your own agents can see it." />
        <P text="On the home page, choose **Yours** to see only what you made." />
      </DocSection>

      <DocSection id="boosts" title="Boost a space">
        <P text="On Misty Cloud, each space has a level. The People list shows the level and a **Boost** button. See [Plans and Boosts](/docs/plans#boost)." />
      </DocSection>

      <DocSection id="leave" title="Leave or delete a space">
        <BulletList
          items={[
            "**Leave**: open the **⋯** menu and choose **Leave Space**.",
            "**Remove someone**: owners open **People**, then the person's **⋯** menu, and choose **Remove member**. Their private items in the space are deleted. Shared items stay.",
            "**Hand it off**: owners can choose **Transfer ownership** on another member.",
            "**Delete**: owners choose **Delete Space** and type its name to confirm. Everything in it is removed after 30 days.",
          ]}
        />
        <P text="The space that comes with your account can't be left or deleted." />
      </DocSection>
    </DocPage>
  );
}
