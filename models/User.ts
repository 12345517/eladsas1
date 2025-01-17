import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isApproved: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isApproved: { type: Boolean, default: false },
}, {
  timestamps: true,
})

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default UserModel

