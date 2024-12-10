import { RegistrationModel } from '../models/registration.model'
import { ApiStore } from '../pages/apiClass.page'
import { RegistrationPage } from '../pages/registration.page'
import { expect, test } from '@playwright/test'

test.describe('registration tests', () => {
  test('new registration test', async ({ page, request }) => {
    const registrationPage = new RegistrationPage(page)
    const apiStore = new ApiStore(request)

    const registerUser: RegistrationModel = {
      firstName: 'Tom',
      lastName: 'Riddle',
      dateOfBirth: '1980-12-23',
      address: 'Elmo street 14',
      postCode: '00-136',
      city: 'Chicago',
      state: 'Chicago',
      country: 'US',
      phone: '123456789',
      email: 'TomRiddleee2233345556@test.com',
      password: 'NightmareOfTheElmStreet12#',
    }
    await registrationPage.goToRegPage()
    await registrationPage.registerUser(registerUser)
    await expect(page).toHaveURL(
      'https://practicesoftwaretesting.com/auth/login',
    )

    const token = await apiStore.loginUser(
      registerUser.email,
      registerUser.password,
    )
    console.log(token)
  })
})
