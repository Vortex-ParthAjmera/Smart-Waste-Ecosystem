import { FictionalAccounts, type LoginRole } from "@/components/fictional-accounts";

type AuthFallbackPageProps = {
  searchParams?: {
    role?: string | string[];
  };
};

function resolveInitialRole(role: string | string[] | undefined): LoginRole {
  if (role === "citizen" || role === "municipal" || role === "developer") {
    return role;
  }

  return "citizen";
}

export default function AuthFallbackPage({ searchParams }: AuthFallbackPageProps) {
  return <FictionalAccounts initialRole={resolveInitialRole(searchParams?.role)} />;
}
