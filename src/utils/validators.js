// Simple form checks. Each returns true when the value is acceptable.
export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim())
export const isPhone = (value) => /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, ''))
export const isPincode = (value) => /^[1-9]\d{5}$/.test(value.trim())

// Returns an object of error messages, e.g. { phone: 'Enter a valid 10-digit mobile number.' }.
// An empty object means the form is valid.
export function validateCheckout(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!isPhone(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (!isEmail(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.line1.trim()) errors.line1 = 'Address is required.'
  if (!values.city.trim()) errors.city = 'City is required.'
  if (!values.state) errors.state = 'Please select a state.'
  if (!isPincode(values.pincode)) errors.pincode = 'Enter a valid 6-digit PIN code.'
  if (!values.agree) errors.agree = 'Please accept the terms to place your order.'
  return errors
}
