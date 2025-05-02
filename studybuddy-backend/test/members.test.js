const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const memberRoutes = require('../routes/members');
const db = require('../db/database');

const app = express();
app.use(bodyParser.json());
app.use('/api/members', memberRoutes);

beforeAll(done => {
  db.run('DELETE FROM members', () => {
    db.run('INSERT INTO members (user_id, group_id) VALUES (?, ?)', [1, 1], done);
  });
});

describe('Member API Endpoints', () => {
  it('should get all members', async () => {
    const res = await request(app).get('/api/members');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new member', async () => {
    const res = await request(app).post('/api/members').send({
      user_id: 2,
      group_id: 1
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a member', async () => {
    const createRes = await request(app).post('/api/members').send({
      user_id: 3,
      group_id: 1
    });

    const id = createRes.body.id;
    const updateRes = await request(app).put(`/api/members/${id}`).send({
      user_id: 4,
      group_id: 2
    });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.updated).toBeGreaterThan(0);
  });

  it('should delete a member', async () => {
    const createRes = await request(app).post('/api/members').send({
      user_id: 5,
      group_id: 1
    });

    const id = createRes.body.id;
    const deleteRes = await request(app).delete(`/api/members/${id}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.deleted).toBe(1);
  });
});