const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const groupRoutes = require('../routes/groups');
const db = require('../db/database');

const app = express();
app.use(bodyParser.json());
app.use('/api/groups', groupRoutes);

beforeAll(done => {
  db.run("DELETE FROM groups", () => {
    db.run("INSERT INTO groups (name, description) VALUES (?, ?)", ['Test Group', 'A test group'], done);
  });
});

describe('Group API Endpoints', () => {
  it('should get all groups', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new group', async () => {
    const res = await request(app).post('/api/groups').send({
      name: 'New Group',
      description: 'A new study group'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a group', async () => {
    const createRes = await request(app).post('/api/groups').send({
      name: 'Edit Group',
      description: 'Before editing'
    });

    const id = createRes.body.id;
    const updateRes = await request(app).put(`/api/groups/${id}`).send({
      name: 'Edited Group',
      description: 'After editing'
    });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.updated).toBeGreaterThan(0);
  });

  it('should delete a group', async () => {
    const createRes = await request(app).post('/api/groups').send({
      name: 'Group To Delete',
      description: 'Temporary group'
    });

    const id = createRes.body.id;
    const deleteRes = await request(app).delete(`/api/groups/${id}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.deleted).toBe(1);
  });
});
