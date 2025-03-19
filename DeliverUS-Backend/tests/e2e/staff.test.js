import { getApp, shutdownApp } from './utils/testApp'
import { getLoggedInOwner, getLoggedInCustomer } from './utils/auth'
import { getFirstRestaurantOfOwner } from './utils/restaurant'

import request from 'supertest'

describe('Add restaurant staff', () => {
  let restaurant, owner, customer, app
  beforeAll(async () => {
    app = await getApp()
    owner = await getLoggedInOwner()
    customer = await getLoggedInCustomer()
    restaurant = await getFirstRestaurantOfOwner(owner)
  })

  it('Should return 401 if not logged in', async () => {
    const staffData = {
      name: 'John Doe',
      position: 'Chef',
      email: 'john.doe@example.com',
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).send(staffData))
    expect(response.status).toBe(401)
  })

  it('Should return 403 if logged in as customer', async () => {
    const staffData = {
      name: 'John Doe',
      position: 'Chef',
      email: 'john.doe@example.com',
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${customer.token}`).send(staffData))
    expect(response.status).toBe(403)
  })

  it('Should return 422 if staff data is invalid', async () => {
    const staffData = {
      name: '', // Empty name
      position: 'Chef',
      email: 'john.doe@example.com',
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send(staffData))
    expect(response.status).toBe(422)
  })

  it('Should return 422 if email format is invalid', async () => {
    const staffData = {
      name: 'John Doe',
      position: 'Chef',
      email: 'invalid-email', // Invalid email format
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send(staffData))
    expect(response.status).toBe(422)
  })

  it('Should return 200 if everything is ok', async () => {
    const staffData = {
      name: 'John Doe',
      position: 'Chef',
      email: 'john.doe@example.com',
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send(staffData))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(staffData.name)
    expect(response.body.position).toBe(staffData.position)
    expect(response.body.email).toBe(staffData.email)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Get restaurant staff', () => {
  let restaurant, owner, customer, app
  beforeAll(async () => {
    app = await getApp()
    owner = await getLoggedInOwner()
    customer = await getLoggedInCustomer()
    restaurant = await getFirstRestaurantOfOwner(owner)
  })

  it('Should return 401 if not logged in', async () => {
    const response = (await request(app).get(`/restaurants/${restaurant.id}/staff`).send())
    expect(response.status).toBe(401)
  })

  it('Should return 403 if logged in as customer', async () => {
    const response = (await request(app).get(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${customer.token}`).send())
    expect(response.status).toBe(403)
  })

  it('Should return 200 if the request was succesful', async () => {
    const response = (await request(app).get(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send())
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('All staff members must belong to the restaurant', async () => {
    const response = (await request(app).get(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send())
    expect(response.body.every(staff => staff.restaurantId === restaurant.id)).toBe(true)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})

describe('Remove staff member', () => {
  let restaurant, owner, customer, app, staffId
  beforeAll(async () => {
    app = await getApp()
    owner = await getLoggedInOwner()
    customer = await getLoggedInCustomer()
    restaurant = await getFirstRestaurantOfOwner(owner)

    // Create a staff member to remove later
    const staffData = {
      name: 'Staff to Remove',
      position: 'Waiter',
      email: 'staff.remove@example.com',
      phone: '+34666778899',
      restaurantId: restaurant.id
    }
    const response = (await request(app).post(`/restaurants/${restaurant.id}/staff`).set('Authorization', `Bearer ${owner.token}`).send(staffData))
    staffId = response.body.id
  })

  it('Should return 401 if not logged in', async () => {
    const response = (await request(app).delete(`/restaurants/${restaurant.id}/staff/${staffId}`).send())
    expect(response.status).toBe(401)
  })

  it('Should return 403 if logged in as customer', async () => {
    const response = (await request(app).delete(`/restaurants/${restaurant.id}/staff/${staffId}`).set('Authorization', `Bearer ${customer.token}`).send())
    expect(response.status).toBe(403)
  })

  it('Should return 404 if staff member does not exist', async () => {
    const response = (await request(app).delete(`/restaurants/${restaurant.id}/staff/9999`).set('Authorization', `Bearer ${owner.token}`).send())
    expect(response.status).toBe(404)
  })

  it('Should return 200 if everything is ok', async () => {
    const response = (await request(app).delete(`/restaurants/${restaurant.id}/staff/${staffId}`).set('Authorization', `Bearer ${owner.token}`).send())
    expect(response.status).toBe(200)
  })

  afterAll(async () => {
    await shutdownApp()
  })
})
