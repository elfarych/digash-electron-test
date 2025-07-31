export const REFERRAL_ID = 'digash-ref_code';
export const REFERRAL_FRIEND_ID = 'digash-friend-ref_code';

export const getReferralId = () => localStorage.getItem(REFERRAL_ID);
export const getReferralFriendId = () =>
  localStorage.getItem(REFERRAL_FRIEND_ID);

export const setReferralId = (referralId: string) =>
  localStorage.setItem(REFERRAL_ID, referralId);
export const setReferralFriendId = (referralId: string) =>
  localStorage.setItem(REFERRAL_FRIEND_ID, referralId);
