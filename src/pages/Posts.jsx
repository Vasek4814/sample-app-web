import { useEffect, useState } from 'react';
import { fetchPosts } from '../utils/postsApi';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPosts();
        if (!cancelled) {
          setPosts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div data-testid="posts-loading">Loading posts...</div>;
  }

  if (error) {
    return <div data-testid="posts-error">Error: {error}</div>;
  }

  return (
    <div data-testid="posts-page">
      <h1>Posts</h1>
      <p data-testid="posts-count">Total: {posts.length}</p>
      <ul data-testid="posts-list">
        {posts.map((post) => (
          <li key={post.id} data-testid="post-item">
            <h2 data-testid="post-title">{post.title}</h2>
            <p data-testid="post-body">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
