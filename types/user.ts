import { ObjectId } from 'mongodb'

export const USERS_COLLECTION = 'users'

export type MembershipType = 'Kit Registro' | 'Pre Junior' | 'Junior' | 'Master' | 'Águila Dorada'

export interface User {
  _id: ObjectId
  email: string
  password: string
  name: string
  membership: MembershipType
  referralCode: string
  referredBy?: ObjectId
  referrals: ObjectId[]
  earnings: number
  isApproved: boolean
  paymentProof?: string
  points: number
  createdAt: Date
  updatedAt: Date
}

export interface SafeUser {
  id: string
  email: string
  name: string
  role: string
  isApproved: boolean
}

declare module "next-auth" {
  interface Session {
    user: SafeUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isApproved: boolean
  }
}