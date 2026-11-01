import {
  CodeBlock,
  DocSection,
  DocTable,
  P,
  Paragraphs,
  Steps,
} from "./components/Prose";
import { DocPage } from "./components/DocPage";
import type { EnvVariable, IntegrationDoc } from "./integrations";

function variableRows(variables: EnvVariable[]): string[][] {
  return variables.map(({ name, about, howTo, optional }) => [
    name,
    optional ? `${about} Optional.` : about,
    howTo,
  ]);
}

/** One env file: what it's for, the account it needs, its values and how to get them. */
export default function IntegrationPage({ doc }: { doc: IntegrationDoc }) {
  return (
    <DocPage title={doc.file} description={doc.summary}>
      <DocSection id="purpose" title="What it's for">
        <Paragraphs items={doc.purpose} />
      </DocSection>

      <DocSection id="account" title="The account you need">
        <Paragraphs items={doc.account} />
      </DocSection>

      <DocSection id="variables" title="Values you set">
        <DocTable
          columns={["Variable", "What it is", "How to get it"]}
          rows={variableRows(doc.youSet)}
          monoFirstColumn
        />
      </DocSection>

      {doc.sections?.map((section) => (
        <DocSection key={section.id} id={section.id} title={section.title}>
          {section.paragraphs ? (
            <Paragraphs items={section.paragraphs} />
          ) : null}
          {section.table ? (
            <DocTable
              columns={section.table.columns}
              rows={section.table.rows}
            />
          ) : null}
        </DocSection>
      ))}

      <DocSection id="steps" title="Get the values">
        <Steps items={doc.steps} />
        <CodeBlock code={doc.example} label={`server/.env/${doc.file}`} />
        <P text="Keep the file out of Git. Misty's `.gitignore` already ignores everything under `server/.env/`." />
      </DocSection>
    </DocPage>
  );
}
