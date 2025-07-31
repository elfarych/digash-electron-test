export interface UpdatePost {
  id: number;
  title_ru: string;
  title_en: string;
  title_hi: string;
  title_bn: string;
  title_uk: string;
  description_ru: string;
  description_en: string;
  description_hi: string;
  description_bn: string;
  description_uk: string;
  image: string;
  created_at: string;
}

export interface UpdatePostDetail extends UpdatePost {
  content_ru: string;
  content_en: string;
  content_uk: string;
  content_hi: string;
  content_bn: string;
}
