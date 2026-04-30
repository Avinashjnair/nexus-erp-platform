/**
 * Base API client.
 *
 * All service functions go through here. Currently backed by in-memory mock data
 * (simulated network delay). To connect a real backend, replace the `_mockFetch`
 * internals with real fetch calls — the public surface stays identical.
 *
 * Production swap-in:
 *   export const BASE_URL = import.meta.env.VITE_API_URL;
 *   const headers = () => ({ Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' });
 *   export async function get<T>(path: string): Promise<T> {
 *     const res = await fetch(`${BASE_URL}${path}`, { headers: headers() });
 *     if (!res.ok) throw new ApiError(res.status, await res.text());
 *     return res.json();
 *   }
 */

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const MOCK_LATENCY_MS = 280;

export function simulateDelay(ms = MOCK_LATENCY_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Wraps a mock data factory in a simulated async call, matching real API ergonomics. */
export async function mockGet<T>(factory: () => T): Promise<T> {
  await simulateDelay();
  return factory();
}

export async function mockMutate<T>(factory: () => T): Promise<T> {
  await simulateDelay(180);
  return factory();
}
