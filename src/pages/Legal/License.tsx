import LegalPage, { LegalLink, type LegalSectionDef } from "./LegalPage";

const sections: LegalSectionDef[] = [
  {
    id: "desktop-license",
    title: "Your license to the Misty app",
    body: (
      <p>
        The license that covers the Misty desktop application is part of our{" "}
        <LegalLink to="/terms#license">Terms of Service, section 3</LegalLink>.
        Installing or using the app means you accept those Terms.
      </p>
    ),
  },
  {
    id: "open-source",
    title: "Open-source components",
    body: (
      <p>
        Misty includes open-source software, which is licensed under its own
        terms. Where an open-source license gives you broader rights than our
        Terms, that license applies to that component.
      </p>
    ),
  },
];

export default function License() {
  return (
    <LegalPage
      title="License Agreement"
      summary="The license covering the Misty desktop application."
      sections={sections}
    />
  );
}
