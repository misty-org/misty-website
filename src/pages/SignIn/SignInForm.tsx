import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
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
          <Button
            asChild
            variant="link"
            className="h-auto self-start p-0 text-foreground"
          >
            <NavLink to="/sign-in">Forgot your password?</NavLink>
          </Button>
        </div>

        {error ? <AuthMessage tone="error" message={error} /> : null}

        <AuthSubmitButton
          idleLabel="Sign In"
          loadingLabel="Signing in..."
          loading={loading}
        />
      </form>
    </>
  );
}
