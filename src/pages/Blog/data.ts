interface BlogPost {
  title: string;
  date: string;
  summary: string;
  tag: string;
  historicalContext?: string;
}

export const posts: BlogPost[] = [
  {
    title: "Introducing Misty: one app for all your cloud files",
    date: "December 2025",
    summary:
      "We built Misty because managing files across Google Drive, OneDrive, and iCloud shouldn't require three different apps. Here's the story behind it.",
    tag: "Archive",
    historicalContext:
      "This post documents Misty's original file-first direction. Misty is now a browser workspace with native tools, agents, and encrypted sync across computers.",
  },
];
