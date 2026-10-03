import { test, expect } from './posts.fixture';

const MOCK_POSTS = [
  { id: 1, userId: 1, title: 'Mock Post One', body: 'Body of mock post one' },
  { id: 2, userId: 1, title: 'Mock Post Two', body: 'Body of mock post two' },
  { id: 3, userId: 2, title: 'Mock Post Three', body: 'Body of mock post three' },
];

test.describe('PostsPage — мокинг API', () => {
  test('Мок: успешный ответ — рендерит список постов', async ({ page, mockPosts }) => {
    await mockPosts.success(MOCK_POSTS);
    await page.goto('/posts');
    await expect(page.getByTestId('posts-loading')).toBeHidden();
    await expect(page.getByTestId('post-item')).toHaveCount(3);
    await expect(page.getByTestId('posts-count')).toHaveText('Total: 3');
    await expect(page.getByTestId('post-title').first()).toHaveText('Mock Post One');
    await expect(page.getByTestId('post-body').first()).toHaveText('Body of mock post one');
  });

  test('Мок: ошибка 500 — показывает сообщение об ошибке', async ({ page, mockPosts }) => {
    await mockPosts.error(500, { error: 'Internal Server Error' });
    await page.goto('/posts');
    await expect(page.getByTestId('posts-error')).toBeVisible();
    await expect(page.getByTestId('posts-error')).toContainText('500');
  });

  test('Мок: 404 Not Found — показывает ошибку', async ({ page, mockPosts }) => {
    await mockPosts.error(404, { error: 'Not Found' });
    await page.goto('/posts');
    await expect(page.getByTestId('posts-error')).toContainText('404');
  });

  test('Мок: 401 Unauthorized — показывает ошибку', async ({ page, mockPosts }) => {
    await mockPosts.error(401, { error: 'Unauthorized' });
    await page.goto('/posts');
    await expect(page.getByTestId('posts-error')).toContainText('401');
  });

  test('Мок: пустой список — рендерит 0 постов', async ({ page, mockPosts }) => {
    await mockPosts.empty();
    await page.goto('/posts');
    await expect(page.getByTestId('posts-count')).toHaveText('Total: 0');
    await expect(page.getByTestId('post-item')).toHaveCount(0);
  });

  test('Мок: сетевой сбой — показывает ошибку', async ({ page, mockPosts }) => {
    await mockPosts.networkError();
    await page.goto('/posts');
    await expect(page.getByTestId('posts-error')).toBeVisible();
  });

  test('Мок: таймаут — показывает ошибку', async ({ page, mockPosts }) => {
    await mockPosts.timeout();
    await page.goto('/posts');
    await expect(page.getByTestId('posts-error')).toBeVisible();
  });

  test('Мок: медленный ответ — показывает лоадер', async ({ page, mockPosts }) => {
    await mockPosts.delayed(2000, MOCK_POSTS);
    await page.goto('/posts');
    await expect(page.getByTestId('posts-loading')).toBeVisible();
    await expect(page.getByTestId('post-item')).toHaveCount(3);
  });
});
