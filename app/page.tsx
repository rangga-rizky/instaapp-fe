'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import styles from '@/app/style.module.css';
import CreatePostForm from './CreatePostForm';
import { getPosts, like, logout, unlike } from './helper/api';
import type { Post } from './helper/model';
import PostDetail from './PostDetail';
import { CREATE_POST_MODAL, POST_DETAIL_MODAL, POST_RESOURCE_TYPE } from './constant';
import PostCompenent from './Post';
import next from 'next';

export default function Page() {
  const paginationLimit = 3;
  let nextCursor = 0;
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePostId, setActivePostId] = useState(0);
  const [modalOpen, setModalOpen] = useState(null);
  const postIds = useRef(new Set());

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

  const loadMorePosts = async () => {
    if (nextCursor === null) {
      return
    }
    await getPosts(paginationLimit, nextCursor)
    .then(response =>{
      const newPosts = response.data.filter(post => !postIds.current.has(post.id));
      newPosts.forEach(post => postIds.current.add(post.id));
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      nextCursor = response.next_cursor
    })
  };

  const handleNewPostCreated = (newPost) => {
    if (!postIds.current.has(newPost.id)) {
      postIds.current.add(newPost.id);
      setPosts([newPost, ...posts]);
    }
    handleCLoseModal();
  }

  const loadPosts = async (paginationLimit, nextCursor) => {
    const response = await getPosts(paginationLimit, nextCursor)
    .then(response =>{
      const newPosts = response.data;
      newPosts.forEach(post => postIds.current.add(post.id));
      setPosts(newPosts);
      nextCursor = response.next_cursor
    })
  };

  const handleLogout = async () => {
    const response = await logout()
    .then(response =>{
      localStorage.removeItem(`token`)
      router.push('/auth/login');
    })
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    }
    loadPosts(paginationLimit, nextCursor);
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