export interface Promocode {
  message: string;
  discount: { value: number };
  coupon_code: string;
  free_days?: number;
  functions: string;
  constant: boolean;
}
