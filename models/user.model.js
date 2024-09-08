import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import generateCode from '../utils/generateCode.js';
import hashCode from '../utils/hashCode.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide correct email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    trim: true,
    minlength: [8, 'Password must be at least 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    trim: true,
    validate: {
      validator: function (confirmedPassword) {
        return confirmedPassword === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpiresAt: {
    type: Date,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiresAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.generateVerificationCode = function () {
  const code = generateCode();
  this.verificationCode = hashCode(code);
  this.verificationCodeExpiresAt = Date.now() + 10 * 60 * 1000;
  return code;
};

userSchema.methods.checkPasswordValidation = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(12).toString('hex');
  this.verificationToken = hashCode(token);
  this.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model('User', userSchema);
export default User;
