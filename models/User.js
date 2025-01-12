import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isApproved: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
}, {
  timestamps: true,
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel

