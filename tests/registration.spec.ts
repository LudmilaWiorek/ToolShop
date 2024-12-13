import { RegistrationModel } from '../models/registration.model'
import { ApiUser } from '../pages/apiUser.page'
import { RegistrationPage } from '../pages/registration.page'
import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'

test.describe('registration tests', () => {
  test('new registration test', async ({ page, request }) => {
    const registrationPage = new RegistrationPage(page)
    const apiUser = new ApiUser(request)

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
      email: faker.internet.email(),
      password: 'NightmareOfTheElmStreet12#',
    }
    await registrationPage.goToRegPage()
    await registrationPage.registerUser(registerUser)
    await expect(page).toHaveURL(
      'https://practicesoftwaretesting.com/auth/login',
    )

    const token = await apiUser.loginUser(
      registerUser.email,
      registerUser.password,
    )

    console.log(token)
    const apiUserId = await apiUser.getId()
    console.log('api user', apiUserId)
    const deleteUser = await apiUser.deleteUser(apiUserId)
  })
})
