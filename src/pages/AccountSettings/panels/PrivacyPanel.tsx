import { customRowClass, Row, Section } from "../components/SettingsRows";
import { DataSharing } from "./DataSharing";

export function PrivacyPanel() {
  return (
    <div>
      <Section
        title="Data handling"
        description="How Misty treats private and shared content."
      >
        <div className={`${customRowClass} flex flex-col gap-2`}>
          <p className="text-sm font-medium text-foreground">
            Private Files and shared Space content are handled differently.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Private Files operations stay local unless you connect a provider or
            explicitly add content to a Space. Shared Library content is stored
            for that Space, and agents may use context you are permitted to
            access.
          </p>
        </div>
      </Section>

      <Section
        title="Data sharing"
        description="Choose what non-content information you share with Misty."
      >
        <DataSharing />
      </Section>

      <Section
        title="Policies"
        description="Read the agreements that apply to your Misty account."
      >
        <Row label="Privacy Policy">
          <a className="underline underline-offset-4" href="/privacy">
            Read
          </a>
        </Row>
        <Row label="Terms of Service">
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
