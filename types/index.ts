export interface MenuItem {
  id: number;
  menu_type: "thuong" | "vip";
  category: string;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  created_at: string;
}

export interface ContactSettings {
  id: number;
  zalo_enabled: boolean;
  zalo_link: string;
  facebook_enabled: boolean;
  facebook_link: string;
  phone_enabled: boolean;
  phone_number: string;
  sms_enabled: boolean;
  sms_number: string;
  viber_enabled: boolean;
  viber_link: string;
}

export interface MenuPage {
  pageNumber: number;
  category: string;
  items: MenuItem[];
}
