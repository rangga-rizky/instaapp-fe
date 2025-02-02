'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import styles from '@/app/style.module.css';
import CreatePostForm from './CreatePostForm';
import { logout } from './helper/api';

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
  const router = useRouter();
  const [posts, setPosts] = useState(mockPosts);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(null);

  const isModelOpen = (modalID) => {
    return modalOpen === modalID
  };

  const handleOpenModal = (modalID) => {
    setModalOpen(modalID);
  };

  const handleCLoseModal = () => {
    setModalOpen(null);
  };

  const handleOpenCreatePostModal = () => {
    console.log('Create post modal opened');
    handleOpenModal('CREATE-POST');
  };

  const loadMorePosts = () => {
    const newPosts = mockPosts.map(post => ({ ...post, id: post.id + page * mockPosts.length }));
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(prevPage => prevPage + 1);
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

  const handleLogout = async () => {
    const response = await logout()
    .then(response =>{
      localStorage.removeItem(`token`)
      router.push('/auth/login');
    })
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    }

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
      <button onClick={handleOpenCreatePostModal} className={styles.primaryButton}>Create New Post</button>
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
      <Modal isOpen={isModelOpen('CREATE-POST')} onClose={handleCLoseModal}>
        <h2>Create a new Post</h2>
        <CreatePostForm />
      </Modal>
    </div>
  );
}