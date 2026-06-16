-- Add phone number field to member profiles
alter table profiles add column if not exists phone text;
