import User from '../models/user.model.js';
import hashCode from '../utils/hashCode.js';
import createAndSendToken from '../utils/createAndSendToken.js';
import { envVariables } from '../config/envVariables.js';
import saveAndSendeVerificationCode from '../utils/saveAndSendVerificationCode.js';
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
} from '../mails/sendEmails.js';

const signup = async function (request, response) {
  const { name, email, password, passwordConfirm } = request.body;

  try {
    if (!name || !email || !password || !passwordConfirm) {
      throw new Error('Please provide all required fields');
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      throw new Error('This email already exist');
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    saveAndSendeVerificationCode(newUser);

    response.status(201).json({
      status: 'success',
      data: {
        user: {
          ...newUser._doc,
          password: undefined,
        },
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const verifyEmail = async function (request, response) {
  const { verificationCode } = request.body;

  try {
    if (!verificationCode) {
      throw new Error('Please enter verification code');
    }

    const user = await User.findOne({
      verificationCode: hashCode(verificationCode),
      verificationCodeExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error('Invalid or expired verification code');
    }

    await sendWelcomeEmail(user.email, user.name);

    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    createAndSendToken(user._id, response);

    response.status(200).json({
      status: 'success',
      message: 'Verification successfull. Please check your email',
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const login = async function (request, response) {
  const { email, password } = request.body;

  try {
    if (!email || !password) {
      throw new Error('Please enter email and password');
    }

    const user = await User.findOne({ email });
    if (!user.isVerified) {
      saveAndSendeVerificationCode(user);
      throw new Error('Please verify your email first');
    }

    const isValidPassword = await user?.checkPasswordValidation(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    createAndSendToken(user._id, response);
    response.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user._doc,
          password: undefined,
        },
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const logout = async function (request, response) {
  try {
    response.clearCookie('token');
    response.status(200).json({
      status: 'success',
      message: 'User is logout successfull',
    });
  } catch (error) {
    response.status(500).json({
      status: 'error',
      message: 'Failed to logout. Please try again later',
    });
  }
};

const forgotPassword = async function (request, response) {
  const { email } = request.body;

  try {
    if (!email) {
      throw new Error('Please enter your email');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('This email is not exist');
    }

    const token = user.generateVerificationToken();
    const resetURL = `${envVariables.API_URL}/reset-password/${token}`;
    await sendResetPasswordEmail(user.email, resetURL);
    await user.save({ validateBeforeSave: false });

    response.status(200).json({
      status: 'success',
      message: 'Please check your email',
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const resetPassword = async function (request, response) {
  const { newPassword, confirmPassword } = request.body;
  const { token } = request.params;

  try {
    if (!newPassword || !confirmPassword) {
      throw new Error('Please enter new password and confirm it');
    }

    const user = await User.findOne({
      verificationToken: hashCode(token),
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error('Token is invalid or expired');
    }

    user.password = newPassword;
    user.passwordConfirm = confirmPassword;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendResetPasswordSuccessEmail(user.email);

    response.status(200).json({
      status: 'success',
      message: 'Password Reset Successfull, check your email',
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export { signup, verifyEmail, login, logout, forgotPassword, resetPassword };
