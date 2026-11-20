import { customRowClass, Row, Section } from "../components/SettingsRows";
import { DataSharing } from "./DataSharing";

export function PrivacyPanel() {
  return (
    <div>
      <Section title="Data">
        <div className={`${customRowClass} flex flex-col gap-2`}>
          <p className="text-control font-medium text-foreground">
            Private Files and shared space content are handled differently.
          </p>
          <p className="text-control leading-relaxed text-muted-foreground">
            Private Files operations stay local unless you connect a provider or
            explicitly add content to a space. Shared Media content is stored
            for that space, and agents may use context you are permitted to
            access.
          </p>
        </div>
      </Section>

      <Section title="Sharing">
        <DataSharing />
      </Section>

      <Section title="Policies">
        <Row label="Privacy policy">
          <a className="underline underline-offset-4" href="/privacy">
            Read
          </a>
        </Row>
        <Row label="Terms of service">
          <a className="underline underline-offset-4" href="/terms">
            Read
          </a>
        </Row>
        <Row label="License">
          <a className="underline underline-offset-4" href="/license">
            Read
          </a>
        </Row>
      </Section>
    </div>
  );
}
