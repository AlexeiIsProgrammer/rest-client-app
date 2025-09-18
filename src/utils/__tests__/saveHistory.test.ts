import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, collection } from 'firebase/firestore';
import saveHistory from '../saveHistory';
import type { User } from 'firebase/auth';
import type { RESTResponse } from '~/types';

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(() => Promise.resolve({ id: 'test-id' })),
  collection: vi.fn((_, collectionName) => `${collectionName}-ref`),
  serverTimestamp: vi.fn(() => 'server-timestamp'),
}));

vi.mock('~/firebase', () => ({
  db: 'mock-database',
}));

describe('saveHistory', () => {
  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
  } as User;

  const mockResponse = {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    data: '{"message": "Success"}',
    time: 1640995200000,
    duration: 150,
  } as RESTResponse;

  const mockErrorResponse = {
    status: 500,
    statusText: 'Internal Server Error',
    headers: { 'content-type': 'text/plain' },
    data: undefined,
    error: 'Server Error',
    time: 1640995200000,
    duration: 100,
  } as RESTResponse;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save request history with all fields for successful response', async () => {
    const requestBody = '{"test": "data"}';
    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'POST',
      response: mockResponse,
      requestBody,
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'POST',
      statusCode: 200,
      duration: 150,
      timestamp: 'server-timestamp',
      requestSize: JSON.stringify(requestBody).length,
      responseSize: JSON.stringify(mockResponse.data).length,
      error: null,
      encodedPath: '/api/test',
    });
  });

  it('should save request history with error information for error response', async () => {
    const requestBody = '{"test": "data"}';
    const path = '/api/error';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/error',
      method: 'POST',
      response: mockErrorResponse,
      requestBody,
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/error',
      method: 'POST',
      statusCode: 500,
      duration: 100,
      timestamp: 'server-timestamp',
      requestSize: JSON.stringify(requestBody).length,
      responseSize: 0,
      error: 'Server Error',
      encodedPath: '/api/error',
    });
  });

  it('should handle empty request body', async () => {
    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'GET',
      response: mockResponse,
      requestBody: '',
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'GET',
      statusCode: 200,
      duration: 150,
      timestamp: 'server-timestamp',
      requestSize: 0,
      responseSize: JSON.stringify(mockResponse.data).length,
      error: null,
      encodedPath: '/api/test',
    });
  });

  it('should handle undefined response data', async () => {
    const responseWithUndefinedData = {
      ...mockResponse,
      data: undefined,
    } as RESTResponse;

    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'GET',
      response: responseWithUndefinedData,
      requestBody: '',
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'GET',
      statusCode: 200,
      duration: 150,
      timestamp: 'server-timestamp',
      requestSize: 0,
      responseSize: 0,
      error: null,
      encodedPath: '/api/test',
    });
  });

  it('should handle undefined response status and duration', async () => {
    const incompleteResponse = {
      data: '{"message": "Success"}',
      error: '',
    } as RESTResponse;

    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'GET',
      response: incompleteResponse,
      requestBody: '',
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'GET',
      statusCode: null,
      duration: null,
      timestamp: 'server-timestamp',
      requestSize: 0,
      responseSize: JSON.stringify(incompleteResponse.data).length,
      error: '',
      encodedPath: '/api/test',
    });
  });

  it('should handle non-JSON request body', async () => {
    const requestBody = 'plain text body';
    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'POST',
      response: mockResponse,
      requestBody,
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'POST',
      statusCode: 200,
      duration: 150,
      timestamp: 'server-timestamp',
      requestSize: JSON.stringify(requestBody).length,
      responseSize: JSON.stringify(mockResponse.data).length,
      error: null,
      encodedPath: '/api/test',
    });
  });

  it('should handle string data in response', async () => {
    const responseWithStringData = {
      ...mockResponse,
      data: 'Simple text response',
    } as RESTResponse;

    const path = '/api/test';

    await saveHistory({
      user: mockUser,
      url: 'https://api.example.com/test',
      method: 'GET',
      response: responseWithStringData,
      requestBody: '',
      path,
    });

    expect(collection).toHaveBeenCalledWith('mock-database', 'requests');
    expect(addDoc).toHaveBeenCalledWith('requests-ref', {
      uid: 'user123',
      endpoint: 'https://api.example.com/test',
      method: 'GET',
      statusCode: 200,
      duration: 150,
      timestamp: 'server-timestamp',
      requestSize: 0,
      responseSize: JSON.stringify(responseWithStringData.data).length,
      error: null,
      encodedPath: '/api/test',
    });
  });

  it.skip('should handle addDoc errors gracefully', async () => {
    const error = new Error('Firestore error');
    vi.mocked(addDoc).mockRejectedValueOnce(error);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      saveHistory({
        user: mockUser,
        url: 'https://api.example.com/test',
        method: 'GET',
        response: mockResponse,
        requestBody: '',
        path: '/api/test',
      })
    ).rejects.toThrow('Firestore error');

    expect(consoleSpy).toHaveBeenCalledWith('Error saving history:', error);

    consoleSpy.mockRestore();
  });
});
