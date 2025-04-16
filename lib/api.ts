import { supabase } from './supabaseClient';

export async function getReviews() {
  const { data, error } = await supabase.from('reviews').select('*');

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data;
}
