import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import History, { loader as historyLoader } from '../index';
import * as authServer from '~/utils/auth.server';
import * as firestore from 'firebase/firestore';
import transformServerTimestamp from '~/utils/transformServerTimestamp';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  collection: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock('~/utils/transformServerTimestamp', () => ({
  __esModule: true,
  default: vi.fn((seconds: number) => `ts-${seconds}`),
}));

const SignInPage = () => <h1>Sign In Page</h1>;

const testRoutes = [
  {
    path: '/history',
    Component: History,
    loader: historyLoader,
  },
  {
    path: '/signin',
    Component: SignInPage,
  },
];

describe('/history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /signin if user not authenticated', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/history']} />);

    expect(
      await screen.findByRole('heading', { name: /sign in page/i })
    ).toBeInTheDocument();
  });

  it('shows empty message if no history', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });
    (firestore.getDocs as Mock).mockResolvedValue({ docs: [] });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/history']} />);

    expect(
      await screen.findByText(/you have not executed any requests yet/i)
    ).toBeInTheDocument();
  });

  it('renders history list for authorized user', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });
    (firestore.getDocs as Mock).mockResolvedValue({
      docs: [
        {
          id: 'req-1',
          data: () => ({
            uid: 'user-123',
            endpoint: '/api/test',
            method: 'get',
            statusCode: 200,
            duration: 123,
            timestamp: { seconds: 111, nanoseconds: 0 },
            requestSize: 100,
            responseSize: 200,
            encodedPath: '/api/test',
          }),
        },
      ],
    });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/history']} />);

    expect(
      await screen.findByRole('heading', { name: /request history/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: '/api/test' })
    ).toBeInTheDocument();
    expect(await screen.findByText(/method: GET/i)).toBeInTheDocument();
    expect(transformServerTimestamp).toHaveBeenCalledWith(111);
  });
});
