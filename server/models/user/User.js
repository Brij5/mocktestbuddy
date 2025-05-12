console.log('[DEBUG_USER_MODEL] Top of server/models/user/User.js');

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Do not return password by default when querying users
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['Student', 'Admin', 'ExamManager'],
    default: 'Student',
  },
  managedCategoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamCategory',
    },
  ],
  profilePictureUrl: {
    type: String,
    default: '/default_avatar.png', // Placeholder path
  },
  targetExams: {
    type: [String], // Consider changing to [mongoose.Schema.Types.ObjectId] later if linking to an Exam collection
    default: [],
  },
  phoneNumber: {
    type: String,
    // Add validation if needed
  },
  preferredLanguage: {
    type: String,
    default: 'English',
  },
  subscriptionTier: {
    type: String,
    default: 'Free',
    // Could add enum later if needed: ['Free', 'Premium']
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  passwordResetToken: String,
  passwordResetTokenExpiry: Date,
  lastLogin: {
    type: Date,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  // Consider adding fields for tracking progress later
  // testAttempts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestAttempt' }]
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Middleware: Hash password before saving user
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // If password is modified (and not new), set passwordChangedAt
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // Subtract 1 sec to ensure token is issued after password change
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Method: Compare entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

  // Return the unhashed token (to be sent to the user, e.g., via email)
  return resetToken;
};

// Method: Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    // JWTTimestamp is in seconds, passwordChangedAt is a Date object
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed after the token was issued
  return false;
};

const User = mongoose.model('User', userSchema);
console.log('[DEBUG_USER_MODEL] Successfully compiled User model');

export default User;
