function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function userDetailsAreValid(email, password, name) {
  return userCredentialsAreValid(email, password) && !isEmpty(name);
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}
module.exports = {
  userDetailsAreValid: userCredentialsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
