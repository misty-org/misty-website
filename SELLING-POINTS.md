Misty's selling points, written as plain sentences for the website. Use them as body copy; don't turn them into headlines. Mac and Windows support is a baseline, so it belongs on the download button and in the footer rather than in this list.

One line: Misty is a browser with your files and agents built in, connected across every device you own.

1. Misty has a file manager built into the browser, so the files on this computer, your other computers, network drives and your Spaces' cloud Library are one window away. Most work moves between the web and your files, and Misty keeps the folder open next to the page you're working on, so you can find a file and send it where it needs to go without switching apps. Your devices connect to each other directly, so a file on your desktop reaches your laptop at local network speed and never passes through our servers. Transfers show their progress and can be paused, resumed, retried or undone, and because files live in the same workspace as your tabs, your agent can find and organize them too.
   - Fine print: Device-to-device access needs both computers on the same network, or connected through a public tunnel. Don't name a specific tunnel or VPN product. Files doesn't connect to third-party cloud drives.

2. Your open tabs, split panes and website sign-ins sync between your devices, so you can switch computers and keep going without signing in again on most sites. Everything is encrypted on your device before it syncs, with a key only your devices hold, and a compromised server still can't add a device to your account. Your devices keep up with each other even when one of them was off while you worked.
   - Fine print: Some websites tie a sign-in to one device and will ask you to sign in again. Misty shows which sites synced and which didn't.
   - The sync tree on the home page (`src/pages/Home/midnight/SyncTree.tsx`) shows each device's own tree (window → tabs → panes → pages) under the encrypted vault, with official site logos. Pages change constantly and each change travels up to the vault; bookmarks and history travel back down to the other devices. The panel beside it steps through layouts: orientation, virtual windows, tabs and panes (placeholder sketches for now).

3. Misty's agents are built into the browser, so you can describe a task in one sentence and watch an agent do it in real tabs, using your Spaces, files and connected apps. You can take over at any point, save what worked as a workflow, and run it on a schedule. In a shared Space, your agent can ask a teammate's agent for help, and each owner decides whether those requests need approval, are accepted automatically or are turned off.
   - Example prompts: "Gather my two latest notes from the launch Space and upload them to Google Drive." "Organize my Downloads folder by project." "Ask Sam's research agent for last quarter's numbers." "Summarize new pull requests every morning."

4. A Space keeps a project's tabs, notes, tasks, files and conversations together, and you can keep it to yourself or invite people in. Each Space is built from simple apps you add as you need them: Browser, Chat, Journal for notes you edit together live, Planner for tasks, agendas and roadmaps, Library for shared files, Drawing, and Agents. Personal Spaces stay private, and anything you don't share stays yours.

5. Misty runs on the web engine the system already has, WebKit on macOS and WebView2 on Windows, instead of bundling its own copy of Chromium, so the app stays small and the engine gets security fixes from Apple and Microsoft. On macOS you can install extensions from the Firefox Add-ons catalog and see what each one can access before it runs, with private browsing access off by default. Support for Chrome extensions is in progress. You can import profiles and settings from Chrome, Safari, Firefox or Zen.
   - Fine print: Extensions need macOS 15.4 or later and aren't available on Windows. Some extensions use features Misty doesn't fully support yet, and Misty lists them during install instead of showing them as working.
   - Misty no longer ships Backups, Quick Convert, Image Optimizer or Storage Report; don't advertise them.

Short forms: the feature chips are "Built-in Files · Connected devices · Synced sign-ins · Encrypted sync · Native agents · Spaces · Extensions". The meta description is "Misty is a browser with built-in files, synced sign-ins and native agents. Connect your devices and work together in Spaces."

Before publishing, check that each claim is true in the shipped build:

| Claim | Check |
|---|---|
| Files covers local disks, network shares and other devices | `misty/src/features/files/README.md`; "cloud" means the Space Library only |
| Drag from Files into a web page upload | Not yet verified in WebKit; don't show it until it works |
| Agents find files on your other devices | Devices plan approved 2026-10-05; ship before advertising |
| Organize a folder | Currently Mac and other Unix hosts only |
| Website sign-ins sync | Keep the "some sites ask again" fine print |
| Encrypted, servers can't read it | Avoid "zero-knowledge" unless legal approves |
| Sync tree names | Account, vault, devices, workspaces, collections; never "seats" or "takeover" |
| Agent-to-agent requests | Go to other members' published agents in a shared Space |
| Scheduled browser work | Only cloud workflows that use connected apps run on a schedule; browser workflows report unavailable device access |
| Agent context | "Pick up a conversation on any device" is accurate; browser and window tasks stay on the device that has the window; memory holds only what you asked it to remember |
| Space summaries | "What's new in a Space" is fair; "everything in a Space" isn't (searches return at most 50 results; Drawing and Space tabs aren't readable) |
| Firefox extensions | macOS 15.4+ only; on other platforms the runtime returns "Extensions require macOS 15.4 or later." (`misty/src-tauri/src/infra/extensions/native.rs`) |
| Drawing app | Confirm it's in the Space app picker |

Avoid "seamless", "magic" and "revolutionary". Say "fewer sign-ins" or "stay signed in", never "never sign in again". Don't say "cloud file sync", because device files never go through the cloud.
