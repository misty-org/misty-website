import { ChoiceGroup } from "@misty/ui";

type Billing = "monthly" | "yearly";

/** Monthly or yearly billing, as one segmented choice. Yearly says what it saves. */
export function BillingToggle({
  label,
  saving,
  yearly,
  onChange,
}: {
  label: string;
  saving: number;
  yearly: boolean;
  onChange: (yearly: boolean) => void;
}) {
  return (
    <ChoiceGroup<Billing>
      label={label}
      value={yearly ? "yearly" : "monthly"}
      onChange={(value) => onChange(value === "yearly")}
      options={[
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: `Yearly, save ${saving}%` },
      ]}
      className="w-fit"
    />
  );
}
