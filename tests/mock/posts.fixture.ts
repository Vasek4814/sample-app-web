import { test as base } from '@playwright/test';
import { API_BASE } from '../../src/utils/postsApi';
export { expect } from '@playwright/test';

export const POSTS_URL = `${API_BASE}/posts`;

type MockFixtures = {
  mockPosts: {
    success: (posts?: object[]) => Promise<void>;
    error: (status: number, body?: object) => Promise<void>;
    empty: () => Promise<void>;
    networkError: () => Promise<void>;
    timeout: () => Promise<void>;
    delayed: (ms: number, posts?: object[]) => Promise<void>;
  };
};

export const test = base.extend<MockFixtures>({
  mockPosts: async ({ page }, use) => {
    const mockPosts = {
      async success(posts: object[] = []) {
        await page.route(POSTS_URL, (route) =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(posts),
          }),
        );
      },
      async error(status: number, body: object = { error: 'Error' }) {
        await page.route(POSTS_URL, (route) =>
          route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify(body),
          }),
        );
      },
      async empty() {
        await page.route(POSTS_URL, (route) =>
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          }),
        );
      },
      async networkError() {
        await page.route(POSTS_URL, (route) => route.abort('failed'));
      },
      async timeout() {
        await page.route(POSTS_URL, (route) => route.abort('timedout'));
      },
      async delayed(ms: number, posts: object[] = []) {
        await page.route(POSTS_URL, async (route) => {
          await new Promise((r) => setTimeout(r, ms));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(posts),
          });
        });
      },
    };
    await use(mockPosts);
  },
});
