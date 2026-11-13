import {
  BulletList,
  DocSection,
  DocTable,
  Note,
  P,
  Paragraphs,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";

const SIGN_INS = [
  [
    "Sign in with ChatGPT",
    "Your ChatGPT plan's usage, through OpenAI's sign-in for open-source apps.",
    "Nothing beyond your ChatGPT subscription. Use counts against your plan's limits.",
  ],
  [
    "Sign in with OpenRouter",
    "Hundreds of models from many providers, through one OpenRouter account. Signing in has OpenRouter make a key for Misty; you can paste an `sk-or-` key instead.",
    "OpenRouter's price for each model, paid from credits you buy there.",
  ],
  [
    "Ollama Cloud",
    "Open models that Ollama runs for you. Paste a key from ollama.com/settings/keys.",
    "Ollama's plans, starting with a free tier that has usage limits.",
  ],
  [
    "Local Ollama",
    "Open models running on your own computer, with no key. Misty calls `http://127.0.0.1:11434/v1` unless you change the address.",
    "Free. Your computer needs enough memory for the model.",
  ],
  [
    "Paste a key",
    "OpenAI, Anthropic, Google Gemini, Vercel AI Gateway, NVIDIA or any OpenAI-compatible endpoint, plus ElevenLabs for speech and Soniox for transcription. Misty finds the provider from the key's prefix and lists its models to pick from.",
    "Each provider's price per token, billed by that provider.",
  ],
];

const JOBS = [
  [
    "Agent model",
    "Agent runs, the companion and reading pages.",
    "AI is off on this device.",
  ],
  [
    "Fast model",
    "Routing, dictation cleanup, voice notes and day summaries.",
    "The agent model.",
  ],
  [
    "Embedding model",
    "Searching memory and the Library by meaning.",
    "Search still matches words.",
  ],
  ["Transcription and speech", "Voice.", "Voice is off."],
];

/** What each way of signing in to a model means and what it costs. */
export default function Models() {
  return (
    <DocPage title="Models">
      <P text="AI in Misty always runs on your own models, called from your desktop. Misty hosts no model and never charges for AI." />

      <DocSection id="how" title="How it works">
        <Paragraphs
          items={[
            "You pick models in Settings → Models. Keys and sign-ins stay in Misty's credential store on this computer, locked by a key in the system keychain, and your desktop calls the provider directly. No key or model choice ever goes to a Misty server, and a server never calls a model.",
            "Settings belong to the device and stay on it, so each computer has its own keys and sign-ins.",
            "Because the call comes from your desktop, everything below works the same on your own server and on Misty Pro, including Sign in with ChatGPT and a local Ollama. None of it is part of what Misty Pro sells.",
          ]}
        />
      </DocSection>

      <DocSection id="choices" title="Ways to sign in">
        <DocTable
          columns={["Choice", "What it uses", "What it costs"]}
          rows={SIGN_INS}
        />
        <BulletList
          items={[
            "ChatGPT plan usage covers language models only. For memory search and voice, add a provider with embeddings and transcription, such as an OpenAI key or a local Ollama.",
            "You can save several at once, so the agent can run on one provider and search on another.",
          ]}
        />
      </DocSection>

      <DocSection id="web-search" title="Web search">
        <Paragraphs
          items={[
            "Agents search the web from your computer, on your own search key, the same way they use your models. In Settings, next to your models, pick [Decodo](https://decodo.com) or [Serper](https://serper.dev) and paste its API key. The key stays on this device and goes only to that provider.",
            "Serper offers every Google tab, from news and videos to places, shopping and maps. Decodo offers web, news, videos and images. Without a search key, agents work as before and read the pages you give them.",
          ]}
        />
      </DocSection>

      <DocSection id="engines" title="Engines">
        <Paragraphs
          items={[
            "Chat with Claude Code, Codex, OpenCode and other engines, each under your own sign-in. Misty runs them on your computer, and each engine keeps its own sign-in there.",
            "For Misty's own agent, the models on this page apply. To use Claude there, add an Anthropic API key from [console.anthropic.com](https://console.anthropic.com), which Anthropic bills per token, or reach it through OpenRouter.",
          ]}
        />
      </DocSection>

      <DocSection id="apps" title="Connected apps">
        <Paragraphs
          items={[
            "Agents act in apps such as Gmail, Slack and Google Calendar. Apps that offer their own sign-in connect directly, starting from the last setup step. For the rest, add your own Composio key in Settings → Models → Connected apps. The key stays on this computer and goes only to Composio.",
          ]}
        />
      </DocSection>

      <DocSection id="jobs" title="One model for each job">
        <DocTable
          columns={["Job", "Used for", "When it's empty"]}
          rows={JOBS}
        />
        <Paragraphs
          items={[
            "Model IDs are the provider followed by the model's own name, such as `chatgpt/gpt-6.1-sol`, `openrouter/anthropic/claude-sonnet-5.5`, `ollama-cloud/gpt-oss:120b` or `ollama/qwen3:14b`. Check the agent model asks it to call a tool and read a screenshot, the two things every agent run needs, and says which one works.",
          ]}
        />
      </DocSection>

      <DocSection id="agents" title="Agents need a desktop">
        <Paragraphs
          items={[
            "Agents run on your desktop, where your models are. A run you start in the app begins at once. A run that starts somewhere else, such as a mention in Space chat or a schedule, waits until one of your desktops is online, and then that desktop keeps the chat.",
          ]}
        />
        <Note>
          Misty Pro charges for the server and its storage, never for AI, web
          search or connected apps. Whatever you spend on models and searches
          goes to your provider, not to Misty.
        </Note>
      </DocSection>
    </DocPage>
  );
}
