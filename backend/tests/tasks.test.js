const request = require('supertest');
const express = require('express');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const taskRoutes = require('../routes/taskRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');
const User = require('../models/User');
const { generateAccessToken } = require('../services/authService');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

let token;
let user;

beforeAll(async () => {
  await connect();
});

afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

beforeEach(async () => {
  user = await User.create({ name: 'Test', email: 'test@test.com', password: 'hash' });
  token = generateAccessToken({ id: user._id, email: user.email, name: user.name });
});

describe('Task Endpoints', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Task',
        priority: 'High'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.title).toEqual('New Task');
    expect(res.body.data.priority).toEqual('High');
  });

  it('should fetch tasks', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task 1' });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toEqual(1);
  });

  it('should fail to create task with invalid priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Bad Task',
        priority: 'InvalidPriority'
      });
    expect(res.statusCode).toEqual(422); // Zod validation fails
  });
});
