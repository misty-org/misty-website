/**
 * One env file under `~/.misty/server/prod/` and how to fill it in. Text fields accept
 * `code` and [text](href) markup (see RichText). Variable names follow
 * misty's docs/self-hosting.md; when the server renames one, change it here
 * and nowhere else. Generated secrets never go in these files: the setup
 * container keeps them in the stack's `secrets` volume.
 */
export interface EnvVariable {
  name: string;
  /** What the value is, in one sentence. */
  about: string;
  /** Where to find it, or what to write. */
  howTo: string;
  /** Leave it out to keep the default. */
  optional?: boolean;
}

export interface IntegrationTable {
  columns: string[];
  rows: string[][];
}

export interface IntegrationSection {
  id: string;
  title: string;
  paragraphs?: string[];
  table?: IntegrationTable;
}

export interface IntegrationDoc {
  /** The page's path under /docs/self-hosting/. */
  slug: string;
  /** The file under `~/.misty/server/prod/`. */
  file: string;
  /** The service the file configures. */
  service: string;
  /** One sentence for the page description and the self-hosting list. */
  summary: string;
  /** What the server uses it for. */
  purpose: string[];
  /** The account you need and what it costs. */
  account: string[];
  /** Values you write into the file. */
  youSet: EnvVariable[];
  /** How to get the values, in order. */
  steps: string[];
  /** Anything else the page needs, such as a token's permissions. */
  sections?: IntegrationSection[];
  /** The file as you'd write it, with placeholder values. */
  example: string;
}
