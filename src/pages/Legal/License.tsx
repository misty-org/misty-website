import LegalPage, { LegalLink, type LegalSectionDef } from "./LegalPage";
import { REPO_URL } from "@/lib/site";

const sections: LegalSectionDef[] = [
  {
    id: "agpl",
    title: "Misty is licensed under the GNU AGPL",
    body: (
      <>
        <p>
          The Misty desktop app, server, and agent runtime are free software
          under the GNU Affero General Public License, version 3 or any later
          version. You may use, study, change, and share the software.
        </p>
        <p>
          The license is copyleft. If you share Misty or a changed version of
          it, you must share its source under the same license. If you run a
          changed Misty server that other people use over a network, you must
          offer them the source of your changed version too. Running Misty
          unchanged, or changing it only for yourself, needs nothing extra.
        </p>
        <p>
          The software is provided "as is", without warranty of any kind. The
          full license text is in the{" "}
          <a
            className="underline underline-offset-4"
            href={`${REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LICENSE file on GitHub
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "open-source",
    title: "Other open-source components",
    body: (
      <p>
        Misty includes other open-source software, each licensed under its own
        terms.
      </p>
    ),
  },
  {
    id: "trademarks",
    title: "Name and logo",
    body: (
      <>
        <p>
          The license covers the code, not the Misty name or logo. A changed
          version of Misty must use a different name and logo, and it may say
          it's based on Misty. See our{" "}
          <LegalLink to="/terms#license">Terms of Service, section 4</LegalLink>.
        </p>
        <p>
          Misty's{" "}
          <a
            className="underline underline-offset-4"
            href={`${REPO_URL}/blob/main/NOTICE`}
            target="_blank"
            rel="noopener noreferrer"
          >
            NOTICE file
          </a>{" "}
          adds one term under section 7(b) of the AGPL: every copy, changed or
          not, keeps the author attribution in its About screen or legal
          notices.
        </p>
      </>
    ),
  },
];

export default function License() {
  return (
    <LegalPage
      title="License"
      summary="Misty is free software under the GNU AGPL-3.0."
      sections={sections}
    />
  );
}
