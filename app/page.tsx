'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import styles from '@/app/style.module.css';
import CreatePostForm from './CreatePostForm';
import { getPosts, like, logout, unlike } from './helper/api';
import { Post } from './helper/model';
import { formatDistanceToNow } from 'date-fns';
import PostDetail from './PostDetail';
import { CREATE_POST_MODAL, POST_DETAIL_MODAL, POST_RESOURCE_TYPE } from './constant';

export default function Page() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePostId, setActivePostId] = useState(0);
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
    handleOpenModal(CREATE_POST_MODAL);
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

  const handleLoveToggle = async (postId: number, isLiked: boolean) => {
    if (isLiked) { 
      const response = await unlike(POST_RESOURCE_TYPE, postId)
      .then(response =>{

      })
    } else {
      const response = await like(POST_RESOURCE_TYPE, postId)
      .then(response =>{

      })
    }
  };

  const handleComment = (postId: number) => {
    handleOpenModal(POST_DETAIL_MODAL);
    setActivePostId(postId);
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
            <button onClick={() => handleLoveToggle(post.id, post.is_liked_by_user)} className={`${styles.likeButton} ${post.is_liked_by_user ? styles.loved : ''}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.likeIcon}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button> {post.likes_count}
            <button onClick={() => handleComment(post.id)} className={styles.commentButton}>
              💬
            </button> {post.replies_count}
          </div>
        </div>
      ))}
      <Modal isOpen={isModelOpen(CREATE_POST_MODAL)} onClose={handleCLoseModal}>
        <h2>Create a new Post</h2>
        <CreatePostForm onPostCreated={handleNewPostCreated}/>
      </Modal>
      <Modal isOpen={isModelOpen(POST_DETAIL_MODAL)} onClose={handleCLoseModal}>
        <h2>What they said...</h2>
        <PostDetail id={activePostId}/>
      </Modal>
    </div>
  );
}