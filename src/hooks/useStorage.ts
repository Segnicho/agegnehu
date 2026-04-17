import { useState } from 'react';
import { supabase } from '../utils/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (uri: string, bucket: string = 'post-images') => {
    try {
      console.log('--- Starting Image Upload (ArrayBuffer Strategy) ---');
      setUploading(true);
      setError(null);

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${fileName}`;

      console.log('Reading file as base64...');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      console.log('Decoding base64 to ArrayBuffer...');
      const arrayBuffer = decode(base64);
      console.log('ArrayBuffer byteLength:', arrayBuffer.byteLength);

      console.log('Uploading to Supabase Storage...');
      const { data, error: err } = await supabase.storage
        .from(bucket)
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (err) {
        console.error('Supabase Storage Error:', err);
        throw err;
      }

      console.log('Upload successful, generating public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Final Upload Catch:', err);
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
