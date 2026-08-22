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
    const auditEntry: {
      actorId?: string;
      action: string;
      resourceType: string;
      resourceId?: string;
      requestId?: string;
      source: string;
      details?: Record<string, unknown>;
    } = {
      action: opts.action,
      resourceType: opts.resourceType,
      source: AUDIT_SOURCE
    };
    if (opts.actorId) auditEntry.actorId = opts.actorId;
    if (opts.resourceId) auditEntry.resourceId = opts.resourceId;
    if (opts.requestId) auditEntry.requestId = opts.requestId;
    if (opts.details) auditEntry.details = opts.details;
    await createAuditLog(auditEntry);
  } catch {
    // Audit failure must not block the request — log silently
  }
}
