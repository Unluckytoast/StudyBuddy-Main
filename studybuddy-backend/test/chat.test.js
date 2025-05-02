const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes = require('../routes/chat');
const db = require('../db/database');

const app = express();
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes);

beforeAll(done => {
  db.run('DELETE FROM messages', done);
});

describe('Chat API Endpoints', () => {
  it('should send a message', async () => {
    const res = await request(app).post('/api/chat/send').send({
      sender_id: 1,
      receiver_id: 2,
      message: 'Hello!'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get chat history between two users', async () => {
    const res = await request(app).get('/api/chat/history/1/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});