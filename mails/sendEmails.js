import { envVariables } from '../config/envVariables.js';
import { client, sender } from './email.config.js';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates.js';

const sendVerificationEmail = async function (userEmail, verificationCode) {
  const recipients = [{ email: userEmail }];

  try {
    await client.send({
      from: sender,
      to: recipients,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode
      ),
      category: 'Verification Email',
    });
  } catch (error) {
    throw new Error(`Can't send Email as ${error.message}`);
  }
};

const sendWelcomeEmail = async function (userEmail, name) {
  const recipients = [{ email: userEmail }];

  try {
    await client.send({
      from: sender,
      to: recipients,
      template_uuid: envVariables.MAILTRAP_TEMPLATE_ID,
      template_variables: {
        company_info_name: 'Natours App',
        name: name,
      },
    });
  } catch (error) {
    throw new Error(`Can't send email as ${error.message}`);
  }
};

const sendResetPasswordEmail = async function (userEmail, url) {
  const recipients = [{ email: userEmail }];

  try {
    await client.send({
      from: sender,
      to: recipients,
      subject: 'Reset password email',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', url),
      category: 'Reset Password Email',
    });
  } catch (error) {
    throw new Error(`Can't send email as ${error.message}`);
  }
};

const sendResetPasswordSuccessEmail = async function (userEmail) {
  const recipients = [{ email: userEmail }];

  try {
    await client.send({
      from: sender,
      to: recipients,
      subject: 'Password Reset Successfull',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    });
  } catch (error) {
    throw new Error(`Can't send email as ${error.message}`);
  }
};

export {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
