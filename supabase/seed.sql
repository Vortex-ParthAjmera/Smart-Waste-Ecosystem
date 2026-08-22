insert into rulesets(version, active, config) values
('rules-2.0.0', true, '{"acceptedPoints":10,"negativeRequiresVerifiedViolation":true}'::jsonb)
on conflict (version) do nothing;

insert into profiles(id, role, display_alias) values
('00000000-0000-4000-8000-000000000001', 'CITIZEN', 'GreenMadhuban'),
('00000000-0000-4000-8000-000000000002', 'VERIFICATION_OFFICER', 'VerifierDemo'),
('00000000-0000-4000-8000-000000000003', 'DEVELOPER', 'EdgeOperator')
on conflict do nothing;

insert into citizens(id, profile_id, household_suffix, fictional) values
('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'SGV-002', true)
on conflict do nothing;

insert into gateways(id, gateway_code) values
('20000000-0000-4000-8000-000000000001', 'SGV-GW-001')
on conflict do nothing;

insert into devices(id, gateway_id, device_code, firmware_version) values
('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'ESP32-001', 'smart-waste-esp32-1.0.0')
on conflict do nothing;
