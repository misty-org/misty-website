import { Field, Input } from "@misty/ui";

interface AuthFieldProps {
  id: string;
  label: string;
  name?: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function AuthField({
  id,
  label,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  required,
  disabled,
  onChange,
}: AuthFieldProps) {
  return (
    <Field label={label}>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}
