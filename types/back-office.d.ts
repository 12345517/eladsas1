interface BackOfficeData {
  user: User;
  directReferrals: User[];
  secondLevelReferrals: { [key: string]: User[] };
}