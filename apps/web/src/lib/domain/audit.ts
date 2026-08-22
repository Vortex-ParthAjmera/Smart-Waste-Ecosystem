// Domain audit logger — structured append-only entries for state-changing mutations.

import { createAuditLog } from '@/lib/supabase/audit';

const AUDIT_SOURCE = 'cloud-api';

export async function auditLog(opts: {
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    await createAuditLog({
      actorId: opts.actorId,
      action: opts.action,
      resourceType: opts.resourceType,
      resourceId: opts.resourceId,
      requestId: opts.requestId,
      source: AUDIT_SOURCE,
      details: opts.details,
    });
  } catch {
    // Audit failure must not block the request — log silently
  }
}
