'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/style.module.css';

const mockPosts = [
  {
    id: 1,
    imageUrl: 'https://via.placeholder.com/150',
    likes: 120,
    loved: true,
    replies: ['Great post!', 'Nice picture!']
  },
  {
    id: 2,
    imageUrl: 'https://via.placeholder.com/150',
    likes: 80,
    loved: false,
    replies: ['Awesome!', 'Love it!']
  },
];

export default function Page() {
  const [posts, setPosts] = useState(mockPosts);
  const [page, setPage] = useState(1);

  const loadMorePosts = () => {
    const newPosts = mockPosts.map(post => ({ ...post, id: post.id + page * mockPosts.length }));
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(prevPage => prevPage + 1);
  };

  const createNewPost = () => {
    const newPost = {
      id: posts.length + 1,
      imageUrl: 'https://via.placeholder.com/150',
      likes: 0,
      loved: false,
      replies: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLoveToggle = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, loved: !post.loved, likes: post.loved ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  const handleComment = (postId: number) => {
    // Todo: Implement comment functionality here
    console.log(`Comment on post ${postId}`);
  };

  const handleLogout = () => {
    // Todo: Implement logout functionality here
    console.log('User logged out');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>InstaApp</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </nav>
      <button onClick={createNewPost} className={styles.createPostButton}>Create New Post</button>
      {posts.map(post => (
        <div key={post.id} className={styles.post}>
          <img src={post.imageUrl} alt="Post" />
          <div className={styles.caption}>this is post caption</div>
          <div className={styles.likes}>
            <button onClick={() => handleLoveToggle(post.id)} className={`${styles.likeButton} ${post.loved ? styles.loved : ''}`}>
              ❤️ 
            </button> {post.likes}
            <button onClick={() => handleComment(post.id)} className={styles.commentButton}>
              💬
            </button> {post.replies.length}
          </div>
        </div>
      ))}
    </div>
  );
}