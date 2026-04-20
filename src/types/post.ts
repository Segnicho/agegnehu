export type PostType = 'lost' | 'found';
export type PostStatus = 'active' | 'reported' | 'hidden' | 'resolved';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  image_url: string | null;
  contact_phone: string | null;
  telegram_username: string | null;
  status: PostStatus;
  edit_token?: string;
  created_at: string;
}

export const CATEGORIES = [
  'Phone',
  'Wallet',
  'Keys',
  'Documents',
  'Bag',
  'Electronics',
  'Jewelry',
  'Clothing',
  'Other',
];

export const LOCATIONS = [
  'Bole',
  'Megenagna',
  'Piassa',
  'Sarbet',
  'Mexico',
  'Kazanchis',
  '4 Kilo',
  '6 Kilo',
  'CMC',
];
