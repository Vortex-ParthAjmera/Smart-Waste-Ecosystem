# ESP32 Firmware

Firmware emits authenticated v1.1 evidence only. It does not receive citizen PII, run ML, calculate points, or call Supabase/Vercel directly.

Provisioning secrets belong in `include/config/provisioning.h`, which is ignored.
