export interface UserReferralReward {
  id: number;
  premium_days: number | null;
  discount: number | null;
  claimed: boolean;
  created_at: boolean;
}

export interface UserReferral {
  id: number;
  claimed: boolean;
  paid: boolean;
}
