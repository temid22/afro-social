export const validate = (values) => {
  const errors = {};
  const usernameRegex = /^[A-Za-z1-9]{3,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

  // if (!values.username || values.username === '') {
  //   errors.username = 'Username is required!';
  // } else if (!usernameRegex.test(values.username)) {
  //   errors.username =
  //     "Username should be 3-16 characters and shouldn't include any special character!";
  // }

  if (!values.email) {
    errors.email = 'Email is required!';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Input a valid email format!';
  }
  if (!values.password) {
    errors.password = 'Password is obviously required!';
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Passwords don't match!";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match!';
  }

  return errors;
};
