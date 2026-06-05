CREATE POLICY "Public read access to music bucket"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'music');