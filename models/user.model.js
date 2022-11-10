import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 64,
    unique: true
  },
  email: {
    type: String,
    required: true,
    max: 64,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
}, { timestamps: true })

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(this.password, salt)

  this.password = hashPassword
  return next()
})

export default mongoose.model('User', UserSchema)
