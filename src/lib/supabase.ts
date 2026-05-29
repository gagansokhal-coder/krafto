import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Simulate initial progress
  onProgress?.(10);

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  onProgress?.(90);

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  onProgress?.(100);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  // Extract the path from the public URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/product-images/<path>
  const urlParts = publicUrl.split('/storage/v1/object/public/product-images/');
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}
