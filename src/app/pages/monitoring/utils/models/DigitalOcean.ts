export interface DigitalOceanApp {
  app_id: string;
  type: 'app' | 'droplet';
  name: string;
  region: string;
  url: string;
  current_load: number;
  high_load: number;
  app_created_at: string;
  app_updated_at: string;
  updated_at: string;
  is_available: boolean;
}
