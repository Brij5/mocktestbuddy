import User from '../models/user/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto'; // Need crypto for resetPassword
// TODO: Import email sending utility if implementing email sending
// import sendEmail from '../utils/sendEmail'; 
import config from '../config/config.js'; // For client URL

// @desc    Register a new user (Student role only)
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists with this email');
  }

  // Create new user (role defaults to 'Student' based on schema)
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook
    // role: 'Student' // Explicitly setting, though schema default handles it
  });

  if (user) {
    // Decide response: 
    // Option 1: Just send success message (user needs to verify/login separately)
    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Please log in.' // Or: Please check your email to verify.
    });

    // Option 2: Return basic user info (excluding sensitive data like password hash)
    // res.status(201).json({
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    // });

    // Option 3: Log user in immediately (less common if verification is needed)
    // const token = generateToken(user._id, user.role);
    // res.status(201).json({
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   token: token
    // });

  } else {
    res.status(400); // Bad Request
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  // Basic validation
  if (!email || !password) {
    console.log('Missing email or password');
    res.status(400);
    throw new Error('Please provide email and password');
  }

  try {
    // Find user by email - explicitly select password which is hidden by default
    // Also populate managedCategoryIds if they exist for the user
    const user = await User.findOne({ email }).select('+password').populate('managedCategoryIds');
    
    if (!user) {
      console.log('User not found');
      res.status(401);
      throw new Error('Invalid email or password');
    }

    console.log('User found:', user.email);
    console.log('User is verified:', user.isVerified);
    
    // Check if user exists and password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);

    if (isMatch) {
      // Generate token
      const token = generateToken(
        user._id,
        user.role,
        user.role === 'ExamManager' ? user.managedCategoryIds.map(cat => cat._id) : [] // Pass IDs
      );
      console.log('Token generated successfully');

      // Construct response object
      const responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      };

      if (user.role === 'ExamManager') {
        responseData.managedCategoryIds = user.managedCategoryIds.map(cat => cat._id); // Send IDs
        // Optionally, send full category objects if needed by the frontend immediately after login
        // responseData.managedCategories = user.managedCategoryIds; 
      }

      // Send response
      res.json(responseData);
    } else {
      console.log('Invalid password');
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Let the error handler handle it
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password - Generate token
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Important: Don't reveal if the user exists or not for security
    // Send a generic success response even if email not found
    return res.status(200).json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  }

  // Generate reset token (unhashed version)
  const resetToken = user.getResetPasswordToken();

  // Save the hashed token and expiry date to the user document
  await user.save({ validateBeforeSave: false }); // Skip validation to only update token fields

  // Construct reset URL
  // Note: In a real app, send this via email. For now, we might log it or send in response for testing.
  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this because you (or someone else) requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`; // Example message

  try {
    // Placeholder for email sending logic
    // await sendEmail({ email: user.email, subject: 'Password Reset Token', message });
    console.log('Password Reset URL (for testing):', resetUrl); // Log for testing

    res.status(200).json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
      // data: resetUrl // Optional: Send URL in response only for testing/debugging
    });
  } catch (err) {
    console.error('Error in forgotPassword (maybe email sending): ', err);
    // Clear the token fields if email sending fails
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('There was an error processing your request. Please try again.'); // Generic error
  }
});

// @desc    Reset password using token
// @route   POST /api/users/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.token;

  if (!password || !resetToken) {
    res.status(400);
    throw new Error('Please provide a new password and the reset token');
  }

  // Hash the token from the URL params to match the one stored in the DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user by the hashed token and check if token is not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() }, // Check expiry
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password (pre-save hook will hash it)
  user.password = password;
  // Clear the reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  // Save the updated user document (runs password hashing)
  await user.save();

  // Optional: Generate a new login token immediately (or force re-login)
  // const token = generateToken(user._id, user.role);

  res.status(200).json({ 
    success: true, 
    message: 'Password reset successful. You can now log in with your new password.' 
    // token: token // Include if auto-logging in
  });
});
