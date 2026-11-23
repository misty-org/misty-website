import { ChoiceGroup } from "@misty/ui";

type Billing = "monthly" | "yearly";

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
