import { Button, InlineLink, Text } from "@misty/ui";

import { postProofForm } from "@/lib/account_proof";
import { ACCOUNT_PORTAL_URL } from "@/lib/site";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";

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
