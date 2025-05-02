const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../routes/users');
const db = require('../db/database');

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

beforeAll(done => {

  db.run("DELETE FROM users", () => {
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", ['Test User', 'test@example.com'], done);
  });
});

describe('User API Endpoints', () => {
  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new user', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'New User',
      email: 'newuser@example.com'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('New User');
  });

  it('should update a user', async () => {
    const createRes = await request(app).post('/api/users').send({
      name: 'Update Me',
      email: 'updateme@example.com'
    });

    const id = createRes.body.id;
    const updateRes = await request(app).put(`/api/users/${id}`).send({
      name: 'Updated Name',
      email: 'updated@example.com'
    });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.updated).toBeGreaterThan(0);
  });

  it('should delete a user', async () => {
    const createRes = await request(app).post('/api/users').send({
      name: 'Delete Me',
      email: 'deleteme@example.com'
    });

    const id = createRes.body.id;
    const deleteRes = await request(app).delete(`/api/users/${id}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.deleted).toBe(1);
  });
});
