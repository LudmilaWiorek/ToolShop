import { userdata } from '../JSONS/users.json'
import { expect, fixtures as test } from '../fixtures/fixtures.fixture'
import { RegistrationModel } from '../models/registration.model'
import { ApiUser } from '../pages/apiUser.page'
import { faker } from '@faker-js/faker'

test.describe('registration tests', () => {
  test('new registration test', async ({ page, registrationPage, request }) => {
    const apiUser = new ApiUser(request)

    const registerUser: RegistrationModel = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: '1980-12-23',
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
    expect(token).toBeTruthy()
    // sprawdzamy czy zarejestrowany uzytkownik zostal zalogowany
    const apiUserId = await apiUser.getId()
    expect(apiUserId).toBeDefined()

    const email = await apiUser.getEmail()
    expect(email).toBe(registerUser.email)

    const apiAdmin = new ApiUser(request) // only admin can delete users
    await apiAdmin.loginUser(
      userdata.admin[0].email,
      userdata.admin[0].password,
    )

    const deleteResponse = await apiAdmin.deleteUser(apiUserId)

    await expect(deleteResponse.ok()).toBeTruthy()
    await expect(deleteResponse.status()).toBe(204)

    // sprawdzenie, czy użytkownik faktycznie został usunięty
    // const getUserAfterDelete = await apiUser.getId()
    await expect(
      apiUser.loginUser(registerUser.email, registerUser.password),
    ).rejects.toThrowError('Cannot log in!')

    const users = await apiAdmin.searchUser(registerUser.lastName)
    await expect(users.length).toBe(0)
  })
})
