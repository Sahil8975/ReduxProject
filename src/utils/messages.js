export const NOTIFICATIONS = {
  NOTIFICATION_DURATION: 5000,
  SUCCESSFUL_LOGIN: 'You have successfully logged-in.',
  SOMETHING_WENT_WRONG: 'Something went wrong, please try again.',
  SUCCEFUL_LOGOUT: 'You are successfully logged-out.',
  SUCCESS_FORGOT_PASSWORD_LINK: 'Successfully sent password genration link.',
  EMAIL_VERIFICATION_LINK_SENT: 'Email verification link sent, please verify.',
  RESET_PASSWORD_LINK: 'If Email-Id already exists, you will receive link in mailbox to reset password.',
  EMAIL_VERIFICATION_SUCCESS: 'Email id successfully verified.',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed! Please resend password reset link again.',
  INVALID_USER_PASSWORD: 'Invalid username or password.',
  PASSWORD_RESET_FAILED: 'Email verification failed, please resent password again.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully. Login to continue.',
  CHECK_EMAIL_ID: 'Please check your registered Email ID.'
};

export const ERRORS = {
  PASSWORD_REQUIRED: 'Password is required.',
  ALPHANUMERIC_CHARS_ONLY: 'Please enter only alphanumeric characters.',
  PASSWORD_MINIMUM_8_CHARS: 'Password should be minimum 8 characters.',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm Password is required.',
  PASSWORD_MUST_MATCH: 'Passwords must match.',
  EMAIL_MUST_VALID_ADDRESS: 'Email must be a valid email address.',
  ENTER_YOUR_EMAIL: 'Enter your email.',
  ENTER_YOUR_USERNAME: 'Enter your username.',
  ENTER_VALID_USERNAME: 'Please enter valid Username.',
  ENTER_VALID_PASSWORD: 'Please enter valid Password.',
  USERNAME_REQUIRED: 'Username is required.',
  NETWORK_ERROR: 'Network Error',
  REMOVE_ATTACHMENT: 'Failed to remove attachment',
  UPLOAD_ATTACHMENT: 'Failed to upload attachment',
  TRANSACTION_CURRENCY_REQUIRED: 'Transaction Currency Required',
  FUNDING_TYPE_REQUIRED: 'Funding Type Required'
};

export const PASSWORD_POLICY = [
  'Be at least eight characters long.',
  'Should be alphanumeric.',
  'No case sensitivity.',
  'No special characters (like &,%, * , =,/ ,_,.) to be used.',
  'Enter and Confirm password should match.'
];
