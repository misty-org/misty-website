import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, DocTable, P } from "../components/Prose";

const PARTS = [
  [
    "The desktop app",
    "Your computer",
    "Agent chats, the agent browser and every call to your AI.",
  ],
  [
    "The Misty server",
    "Misty Cloud, or your own server",
    "Accounts, spaces, group chat, notes, files and the apps each space added.",
  ],
  [
    "Cloudflare",
    "Misty Cloud's account, or yours",
    "HTTPS, file storage, and live editing of notes and apps.",
  ],
  ["Google", "Your Google Cloud project", "Sign in with Google, on your own server."],
];

/** Which part of Misty does what, and where it runs. */
export default function WhereThingsRun() {
  return (
    <DocPage title="Where things run">
      <P text="Misty has two parts: the desktop app on your computer and a Misty server. Your AI always runs from the desktop app." />

      <DocSection id="parts" title="The parts">
        <DocTable columns={["Part", "Where it runs", "What it does"]} rows={PARTS} />
      </DocSection>

      <DocSection id="agents" title="Agents run on your desktop">
        <BulletList
          items={[
            "Your desktop calls your AI directly. The server never calls a model or stores an AI sign-in.",
            "A chat you start in the app runs right away.",
            "A run that starts elsewhere, such as a mention in space chat, waits until one of your desktops is online.",
          ]}
        />
      </DocSection>

      <DocSection id="devices" title="Your computers">
        <BulletList
          items={[
            "Each computer you sign in on becomes one of your devices.",
            "Your spaces live on the server, so every computer sees the same ones.",
            "Engine sign-ins and settings stay on each computer. Set up your engines on each one.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
