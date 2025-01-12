interface GenealogyTree {
  user: User
  directReferrals: User[]
  secondLevelReferrals: { [key: string]: User[] }
}