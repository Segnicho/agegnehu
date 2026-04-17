import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Post, PostType } from '../types/post';

export const usePosts = (type?: PostType, filter?: { location?: string; category?: string; query?: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (filter?.location) {
        query = query.eq('location', filter.location);
      }

      if (filter?.category) {
        query = query.eq('category', filter.category);
      }

      if (filter?.query) {
        query = query.ilike('title', `%${filter.query}%`);
      }

      const { data, error: err } = await query;

      if (err) throw err;
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [type, filter?.location, filter?.category, filter?.query]);

  return { posts, loading, error, refresh: fetchPosts };
};
