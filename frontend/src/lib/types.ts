export interface ProfileMedia {
  avatar_url: string | null;
  banner_url: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  profile_media: ProfileMedia | null;
}

export interface ProfileUpdateInput {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  avatar_url?: string;
  banner_url?: string;
}
