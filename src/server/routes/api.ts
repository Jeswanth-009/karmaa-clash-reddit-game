import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';

export const api = new Hono();

api.get('/get-posts', async (c) => {
  try {
    // List of subreddits to pull daily challenges from
    const subreddits = ['aww', 'pics', 'gaming', 'mildlyinteresting', 'todayilearned'];
    
    // Pick one at random
    const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];

    // Fetch top 10 posts from the selected community
    const posts = await reddit.getTopPosts({
      subredditName: randomSub,
      timeframe: 'day',
      limit: 10,
    }).all();

    // Map the data for the frontend
    const formattedPosts = posts.map((post) => ({
      title: post.title,
      sub: post.subredditName,
      upvotes: post.score, 
    }));

    return c.json(formattedPosts);
  } catch (error) {
    console.error('Reddit API Error:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});