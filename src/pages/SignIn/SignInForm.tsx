import { NavLink } from "react-router";
import { InlineLink } from "@misty/ui";
import AuthField from "../Auth/AuthField";
import AuthMessage from "../Auth/AuthMessage";
import AuthSubmitButton from "../Auth/AuthSubmitButton";

interface SignInFormProps {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignInForm({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignInFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <AuthField
          id="signin-email"
          type="email"
          label="Email"
          value={email}
          autoComplete="email"
          placeholder="you@example.com"
          required
          onChange={onEmailChange}
        />

        <div className="flex flex-col gap-2">
          <AuthField
            id="signin-password"
            type="password"
            label="Password"
            value={password}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            onChange={onPasswordChange}
          />
          <InlineLink asChild className="self-start text-control">
            <NavLink to="/sign-in">Forgot your password?</NavLink>
          </InlineLink>
        </div>

        {error ? <AuthMessage tone="error" message={error} /> : null}

        <AuthSubmitButton
          idleLabel="Sign in"
          loading={loading}
        />
      </form>
    </>
  );
}
