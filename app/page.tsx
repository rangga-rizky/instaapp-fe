'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import styles from '@/app/style.module.css';
import CreatePostForm from './CreatePostForm';
import { getPosts, logout } from './helper/api';
import { Post } from './helper/model';
import { formatDistanceToNow } from 'date-fns';
import PostDetail from './PostDetail';

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
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
    handleOpenModal('CREATE-POST');
  };

  const loadMorePosts = () => {
    //const newPosts = mockPosts.map(post => ({ ...post, id: post.id + page * mockPosts.length }));
    //setPosts(prevPosts => [...prevPosts, ...newPosts]);
    //setPage(prevPage => prevPage + 1);
  };

  const handleNewPostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    handleCLoseModal();
  }

  const handleLoveToggle = (postId: number) => {
    //setPosts(posts.map(post => 
    //  post.id === postId ? { ...post, loved: !post.loved, likes: post.loved ? post.likes - 1 : post.likes + 1 } : post
    //));
  };

  const handleComment = (postId: number) => {
    handleOpenModal('POST-DETAIL');
  };

  const loadPosts = async () => {
    const response = await getPosts()
    .then(response =>{
      setPosts(response)
    })
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
    loadPosts();
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
          <div className={styles.postHeader}>
            <span className={styles.postAuthor}>by {post.user?.name}</span>
            <span className={styles.postTime}>{formatDistanceToNow(new Date(post.created_at))} ago</span>
          </div>
          <img src={post.image_url} alt="Post" />
          <div className={styles.caption}>{post.caption}</div>
          <div className={styles.likes}>
            <button onClick={() => handleLoveToggle(post.id)} className={`${styles.likeButton} ${post.id ? styles.loved : ''}`}>
              ❤️ 
            </button> {post.likes_count}
            <button onClick={() => handleComment(post.id)} className={styles.commentButton}>
              💬
            </button> {post.replies_count}
          </div>
        </div>
      ))}
      <Modal isOpen={isModelOpen('CREATE-POST')} onClose={handleCLoseModal}>
        <h2>Create a new Post</h2>
        <CreatePostForm onPostCreated={handleNewPostCreated}/>
      </Modal>
      <Modal isOpen={isModelOpen('POST-DETAIL')} onClose={handleCLoseModal}>
        <h2>What they said...</h2>
        <PostDetail/>
      </Modal>
    </div>
  );
}