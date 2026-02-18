export interface RegistrationModel {
  firstName: string
  lastName: string
  birthDate: string
  address: string
  postCode: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  password: string
}
export interface AddressModel {
  street: string
  city: string
  state: string
  country: string
  postal_code: string
}
export interface UserModel {
  firstName: string
  lastName: string
  birthDate: string
  address: AddressModel
  phone: string
  dob: string
  email: string
  id: string
  provider: string
  totp_enabled: boolean
  enabled: boolean
  failed_login_attempts: number
  created_at: string
}
