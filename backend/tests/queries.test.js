require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const Query = require('../src/models/appModels/Query');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const adminAuth = require('../src/controllers/coreControllers/adminAuth');

// Mock the adminAuth middleware
jest.mock('../src/controllers/coreControllers/adminAuth', () => ({
  isValidAuthToken: (req, res, next) => next(),
}));

// Ensure models are loaded before tests
require('../src/models/index')();

describe('Query API Endpoints', () => {
  let testQuery;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoDB URI:', uri);
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 1,
      });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      throw err;
    }
  }, 30000);

  beforeEach(async () => {
    try {
      testQuery = await Query.create({
        customerName: 'Test Customer',
        description: 'Initial test query',
        status: 'Open',
      });
      console.log('Created test query:', testQuery._id);
    } catch (err) {
      console.error('Error creating test query:', err.message);
      throw err;
    }
  }, 10000);

  afterEach(async () => {
    try {
      await Query.deleteMany({ customerName: 'Test Customer' });
      console.log('Cleaned up Query collection');
    } catch (err) {
      console.error('Error cleaning up Query collection:', err.message);
      throw err;
    }
  }, 10000);

  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err.message);
      throw err;
    }
  }, 10000);

  describe('POST /api/queries', () => {
    it('should create a new query', async () => {
      const newQuery = {
        customerName: 'New Customer',
        description: 'New query description',
      };

      const res = await request(app).post('/api/queries').send(newQuery);

      console.log('POST /api/queries response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.customerName).toBe(newQuery.customerName);
      expect(res.body.description).toBe(newQuery.description);
      expect(res.body.status).toBe('Open');
    }, 10000);

    it('should return 400 when required fields are missing', async () => {
      const invalidQuery = {
        description: 'Missing customer name',
      };

      const res = await request(app).post('/api/queries').send(invalidQuery);

      console.log('POST /api/queries (invalid) response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    }, 10000);
  });

  describe('GET /api/queries', () => {
    it('should retrieve queries with pagination', async () => {
      await Query.create([
        { customerName: 'Test Customer 2', description: 'Query 2', status: 'Open' },
        { customerName: 'Test Customer 3', description: 'Query 3', status: 'Closed' },
      ]);

      const res = await request(app).get('/api/queries?page=1&limit=2');

      console.log('GET /api/queries response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.queries).toBeInstanceOf(Array);
      expect(res.body.queries.length).toBeLessThanOrEqual(2);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pages');
    }, 10000);

    it('should filter queries by status', async () => {
      await Query.create([
        { customerName: 'Test Customer 2', description: 'Query 2', status: 'Closed' },
      ]);

      const res = await request(app).get('/api/queries?status=Open');

      console.log('GET /api/queries (status filter) response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.queries).toBeInstanceOf(Array);
      expect(res.body.queries.every((query) => query.status === 'Open')).toBe(true);
    }, 10000);
  });

  describe('GET /api/queries/:id', () => {
    it('should retrieve a single query by ID', async () => {
      const res = await request(app).get(`/api/queries/${testQuery._id}`);

      console.log('GET /api/queries/:id response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toBe(testQuery._id.toString());
      expect(res.body.customerName).toBe(testQuery.customerName);
    }, 10000);

    it('should return 404 when query is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/queries/${nonExistentId}`);

      console.log('GET /api/queries/:id (not found) response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Query not found');
    }, 10000);
  });

  describe('PUT /api/queries/:id', () => {
    it('should update an existing query', async () => {
      const updatedData = {
        customerName: 'Updated Customer',
        description: 'Updated description',
        status: 'Closed',
      };

      const res = await request(app).put(`/api/queries/${testQuery._id}`).send(updatedData);

      console.log('PUT /api/queries/:id response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toBe(testQuery._id.toString());
      expect(res.body.customerName).toBe(updatedData.customerName);
      expect(res.body.description).toBe(updatedData.description);
      expect(res.body.status).toBe(updatedData.status);
    }, 10000);

    it('should return 404 when updating non-existent query', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData = {
        customerName: 'Updated Customer',
        description: 'Updated description',
      };

      const res = await request(app).put(`/api/queries/${nonExistentId}`).send(updatedData);

      console.log('PUT /api/queries/:id (not found) response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Query not found');
    }, 10000);
  });

  describe('POST /api/queries/:id/notes', () => {
    it('should add a note to an existing query', async () => {
      const noteData = { content: 'Test note content' };

      const res = await request(app).post(`/api/queries/${testQuery._id}/notes`).send(noteData);

      console.log('POST /api/queries/:id/notes response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.notes).toBeInstanceOf(Array);
      expect(res.body.notes[0]).toHaveProperty('content', noteData.content);
      expect(res.body.notes[0]).toHaveProperty('_id');
    }, 10000);

    it('should return 404 when adding note to non-existent query', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const noteData = { content: 'Test note content' };

      const res = await request(app).post(`/api/queries/${nonExistentId}/notes`).send(noteData);

      console.log('POST /api/queries/:id/notes (not found) response:', res.statusCode, res.body);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Query not found');
    }, 10000);
  });

  describe('DELETE /api/queries/:id/notes/:noteId', () => {
    it('should delete a note from an existing query', async () => {
      // Ensure notes array is initialized
      testQuery.notes = testQuery.notes || [];
      // Add a note to the query
      testQuery.notes.push({ content: 'Test note to delete' });
      await testQuery.save();

      // Refresh the query to ensure the note is persisted
      const refreshedQuery = await Query.findById(testQuery._id);
      console.log('Refreshed query:', JSON.stringify(refreshedQuery, null, 2));

      const noteId = refreshedQuery.notes[0]?._id;
      // Verify noteId exists
      if (!noteId) {
        throw new Error('Note ID not found after saving');
      }

      console.log('Attempting to delete note with ID:', noteId.toString());
      // Check if the note exists in the notes array
      const noteExists = refreshedQuery.notes.id(noteId);
      console.log('Note exists in notes array:', !!noteExists);

      const res = await request(app).delete(
        `/api/queries/${testQuery._id}/notes/${noteId.toString()}`
      );

      console.log('DELETE /api/queries/:id/notes/:noteId response:', res.statusCode, res.body);
      if (res.statusCode !== 200) {
        console.error('Error response:', res.body.error);
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.notes).toBeInstanceOf(Array);
      expect(res.body.notes.length).toBe(0);
    }, 10000);

    it('should return 404 when deleting non-existent note', async () => {
      // Add a note to the query
      testQuery.notes = testQuery.notes || [];
      testQuery.notes.push({ content: 'Test note' });
      await testQuery.save();

      const nonExistentNoteId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(
        `/api/queries/${testQuery._id}/notes/${nonExistentNoteId}`
      );

      console.log(
        'DELETE /api/queries/:id/notes/:noteId (note not found) response:',
        res.statusCode,
        res.body
      );
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Note not found');
    }, 10000);
  });
});
