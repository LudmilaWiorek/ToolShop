import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { RegistrationModel } from '../models/registration.model'
import { ApiUser } from '../pages/apiUser.page'
import { faker } from '@faker-js/faker'

test.describe('registration tests', () => {
  test('new registration test', async ({ page, registrationPage, request }) => {
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

    const apiUserId = await apiUser.getId()
    const deleteUser = await apiUser.deleteUser(apiUserId)
  })
})
