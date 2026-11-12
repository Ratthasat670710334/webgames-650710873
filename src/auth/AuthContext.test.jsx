import { act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { login as loginRequest, register as registerRequest } from '../api/backend';

jest.mock('../api/backend', () => ({
  login: jest.fn(),
  register: jest.fn()
}));

const member = {
  id: 7,
  email: 'member@example.com',
  displayName: 'Member',
  role: 'member'
};

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('login uses API response and saves its token and member', async () => {
  loginRequest.mockResolvedValue({ token: 'api-token', member });
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login(member.email, 'password');
  });

  expect(loginRequest).toHaveBeenCalledWith(member.email, 'password');
  expect(result.current.token).toBe('api-token');
  expect(result.current.member).toEqual(member);
  expect(localStorage.getItem('gamekey_token')).toBe('api-token');
});

test('register creates the account then logs in through the API', async () => {
  registerRequest.mockResolvedValue(member);
  loginRequest.mockResolvedValue({ token: 'api-token', member });
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.register(member.email, 'password', member.displayName);
  });

  expect(registerRequest).toHaveBeenCalledWith(
    member.email,
    'password',
    member.displayName
  );
  expect(loginRequest).toHaveBeenCalledWith(member.email, 'password');
  expect(result.current.token).toBe('api-token');
});

test('discards the previous local mock session', () => {
  localStorage.setItem('gamekey_token', 'mock-token-1');
  localStorage.setItem('gamekey_member', JSON.stringify(member));

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.isLoggedIn).toBe(false);
  expect(localStorage.getItem('gamekey_token')).toBeNull();
  expect(localStorage.getItem('gamekey_member')).toBeNull();
});
