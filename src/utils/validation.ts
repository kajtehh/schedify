import validator from 'validator'

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
}

export function isValidFullName(fullName: string): boolean {
  const fullNameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+(?:\s[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+)+$/;
  return fullNameRegex.test(fullName);
}
