// Audit log adapter — append-only structured audit entries.

import { getSupabaseServerClient } from './index';

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  request_id: string | null;
  source: string;
  details: Record<string, unknown>;
  created_at: string;
}

export async function createAuditLog(opts: {
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  source: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('audit_logs').insert({
    actor_id: opts.actorId ?? null,
    action: opts.action,
    resource_type: opts.resourceType,
    resource_id: opts.resourceId ?? null,
    request_id: opts.requestId ?? null,
    source: opts.source,
    details: opts.details ?? {},
  });
}

export async function getAuditLogsForResource(
  resourceType: string,
  resourceId: string,
  limit: number = 50,
): Promise<AuditLog[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as AuditLog[];
}
