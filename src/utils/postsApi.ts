export const API_BASE = 'https://jsonplaceholder.typicode.com';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/posts`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json() as Promise<Post[]>;
}
