import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('Production Deployment & Resilience Endpoints', () => {
  it('GET /health should return 200 OK status payload', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.realtime).toBe('Active');
  });

  it('GET /api/nonexistent-route should return 404 JSON instead of HTML', async () => {
    const res = await request(app).get('/api/unknown-deployment-test-endpoint');
    expect(res.status).toBe(404);
    expect(res.header['content-type']).toMatch(/json/);
    expect(res.body.message).toContain('not found');
  });
});
