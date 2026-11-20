import { Button, InlineLink, Text } from "@misty/ui";

import { postProofForm } from "@/lib/accountProof";
import { ACCOUNT_PORTAL_URL } from "@/lib/site";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";

/**
 * What someone sees after signing in to an account suspended by a failed payment. They have no
 * session, so they can't reach account settings; the proof from their sign-in opens the card page.
 */
export default function PaymentFailedCard({
  proof,
  onBack,
}: {
  proof: string;
  onBack: () => void;
}) {
  return (
    <AuthShell title="Update your card">
      <AuthCard
        footer={
          <InlineLink className="text-control" onClick={onBack}>
            Back to sign in
          </InlineLink>
        }
      >
        <div className="grid gap-6">
          <Text wrap size="page" role="status" className="text-pretty">
            A payment for your plan failed, so your account is suspended. Your data is safe,
            and the account comes back once the payment goes through.
          </Text>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => postProofForm(ACCOUNT_PORTAL_URL, proof)}
          >
            Update card
          </Button>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
