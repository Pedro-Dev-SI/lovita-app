export interface User {
  id: string
  email: string
  full_name?: string
  subscription_plan: "forever" | "annual" | "none"
  subscription_start_date?: string
  subscription_end_date?: string
  max_images: number
  has_music: boolean
  has_dynamic_background: boolean
  has_exclusive_animations: boolean
  created_at: string
  updated_at: string
}

export interface CouplePage {
  id: string
  user_id: string
  partner1_name: string
  partner2_name: string
  relationship_start_date: string
  qr_code_url?: string
  page_slug: string
  theme_color: string
  background_animation: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  couple_page_id: string
  title?: string
  description?: string
  media_url?: string
  media_type: "image" | "video"
  memory_date?: string
  created_at: string
}

export interface Music {
  id: string
  couple_page_id: string
  song_title: string
  artist?: string
  spotify_url?: string
  youtube_url?: string
  is_primary: boolean
  created_at: string
}

export interface Notification {
  id: string
  couple_page_id: string
  notification_type: "monthly" | "yearly"
  last_sent_date?: string
  is_active: boolean
  created_at: string
}
