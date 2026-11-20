import { NavLink } from "react-router";
import { Button } from "@misty/ui";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";

export default function NotFound() {
  return (
    <AuthShell title="Page not found">
      <AuthCard>
        <div className="text-center">
          <Button variant="primary" size="lg" asChild>
            <NavLink to="/">Go home</NavLink>
          </Button>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
