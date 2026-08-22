export type Role = "CITIZEN" | "MUNICIPAL_OPERATOR" | "VERIFICATION_OFFICER" | "DEVELOPER" | "SYSTEM_ADMIN";

export function demoRoleFromRequest(request: Request): Role {
  const header = request.headers.get("x-demo-role");
  if (header === "MUNICIPAL_OPERATOR" || header === "VERIFICATION_OFFICER" || header === "DEVELOPER" || header === "SYSTEM_ADMIN") {
    return header;
  }
  return "CITIZEN";
}

export function requireRole(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}
