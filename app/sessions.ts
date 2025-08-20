import { createCookieSessionStorage } from '@remix-run/node';

// Configure session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 's3cr3t'], // Use environment variable
    secure: process.env.NODE_ENV === 'production',
  },
});

// Get session from request
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

// Commit session (used for login, etc.)
export async function commitSession(session: any) {
  return sessionStorage.commitSession(session);
}

// Destroy session (used for logout)
export async function destroySession(session: any) {
  return sessionStorage.destroySession(session);
}