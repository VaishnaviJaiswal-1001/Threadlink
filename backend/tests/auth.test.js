const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const authRoutes = require('../routes/authRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Mock passport for google auth routes (we won't test google auth fully here)
jest.mock('passport', () => ({
  authenticate: () => (req, res, next) => next(),
  use: jest.fn(),
  initialize: jest.fn(() => (req, res, next) => next())
}));

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Auth Endpoints', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should fail signup with duplicate email', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User 2',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBeFalsy();
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should fail login with wrong password', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBeFalsy();
  });
});
