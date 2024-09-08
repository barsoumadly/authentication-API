import { sendVerificationEmail } from '../mails/sendEmails.js';

const saveAndSendeVerificationCode = async function (user) {
  const verificationCode = user.generateVerificationCode();
  await sendVerificationEmail(user.email, verificationCode);
  await user.save({ validateBeforeSave: false });
};

export default saveAndSendeVerificationCode;
