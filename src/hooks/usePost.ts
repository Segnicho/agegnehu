import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Post } from '../types/post';

export const usePost = (id: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (err) throw err;
      setPost(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  return { post, loading, error, refresh: fetchPost };
};
