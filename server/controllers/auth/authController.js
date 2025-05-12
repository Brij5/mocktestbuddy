import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendEmail } from '../../utils/emailService.js';
import config from '../../config/config.js';
import User from '../../models/user/User.js';
import ApiError from '../../utils/ApiError.js';

const { jwt: jwtConfig, app } = config;

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Generate verification/reset token hash
 * @returns {Object} Token details
 */
const generateHashToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiry = Date.now() + jwtConfig.resetTokenExpiresIn;
  return { token, hashedToken, expiry };
};

// --- Controller Functions ---

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Generate verification token
  const { token, hashedToken, expiry } = generateHashToken();

  // Create user (password hashing is handled by pre-save hook in model)
  const user = await User.create({
    name,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpiry: expiry,
  });

  // Prepare verification email
  const verificationUrl = `${app.clientUrl}/verify-email/${token}`;
  const message = `Please verify your email by clicking on the following link: \n\n ${verificationUrl} \n\n This link will expire in 10 minutes.`;

  // Send verification email
  await sendEmail({
    to: user.email,
    subject: 'Exam Buddy - Email Verification',
    text: message,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  // Find user by email, include password field for comparison
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists and password matches
  if (!user || !(await user.matchPassword(password))) {
    if (user) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
    }
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if email is verified
  if (!user.isVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  // Reset failed attempts and update last login
  user.failedLoginAttempts = 0;
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id);

  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + jwtConfig.cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Send token in cookie and response
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl,
    },
  });
});

/**
 * @desc    Verify user email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  // Hash the token from the params
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user by hashed token and check expiry
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    // Redirect to frontend with error message
    return res.redirect(
      `${app.clientUrl}/verify-email?success=false&message=Invalid or expired verification link`
    );
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  // Redirect to frontend with success message
  res.redirect(
    `${app.clientUrl}/verify-email?success=true&message=Email verified successfully`
  );
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1) Get user based on POSTed email
  const user = await User.findOne({ email });
  if (!user) {
    // For security reasons, don't reveal if the email exists or not
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }

  // 2) Generate the random reset token
  const { token, hashedToken, expiry } = generateHashToken();

  // 3) Save the encrypted token and expiry to the database
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiry;
  await user.save({ validateBeforeSave: false });

  try {
    // 4) Send it to user's email
    const resetURL = `${app.clientUrl}/reset-password/${token}`;
    
    const message = `Forgot your password? Submit a PATCH request with your new password to: \n\n${resetURL}\n\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      'There was an error sending the email. Try again later!'
    );
  }
});

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new ApiError(400, 'Token is invalid or has expired');
  }

  // 3) Update password and clear reset token fields
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  const token = generateToken(user._id);
  
  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + jwtConfig.cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Send token in cookie and response
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    data: {
      user,
    },
  });
});

export {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
