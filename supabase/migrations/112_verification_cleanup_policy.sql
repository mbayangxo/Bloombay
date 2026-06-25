-- Allow users to delete their own verification files
-- Needed so re-verification can clean up old selfies before uploading a new one.
create policy "Verification delete own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);
