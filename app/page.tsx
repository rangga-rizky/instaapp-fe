'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import styles from '@/app/style.module.css';
import CreatePostForm from './CreatePostForm';
import { getPosts, like, logout, unlike } from './helper/api';
import type { Post } from './helper/model';
import PostDetail from './PostDetail';
import { CREATE_POST_MODAL, POST_DETAIL_MODAL, POST_RESOURCE_TYPE } from './constant';
import PostCompenent from './Post';

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
        <PostCompenent key={post.id} post={post} handleOpenModal={handleOpenModal} setActivePostId={setActivePostId}/>
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