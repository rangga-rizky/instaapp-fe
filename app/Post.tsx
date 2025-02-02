import React, { use, useEffect, useState } from 'react';
import styles from '@/app/style.module.css';
import type { Post } from './helper/model';
import { formatDistanceToNow, set } from 'date-fns';
import { POST_DETAIL_MODAL, POST_RESOURCE_TYPE } from './constant';
import { like, unlike } from './helper/api';

interface PostProps {
  post: Post
  handleOpenModal
  setActivePostId
}

const Post: React.FC<PostProps> = ({post, handleOpenModal,setActivePostId}) => {
    const [loved, setLoved] = useState(post.is_liked_by_user);
    const [likeCount, setLikeCount] = useState(post.likes_count);

    const handleLoveToggle = async (postId: number, isLiked: boolean) => {
      if (isLiked) { 
        const response = await unlike(POST_RESOURCE_TYPE, postId)
        .then(response =>{
          setLoved(false)
          setLikeCount(likeCount - 1)
        })
      } else {
        const response = await like(POST_RESOURCE_TYPE, postId)
        .then(response =>{
          setLoved(true)
          setLikeCount(likeCount + 1)
        })
      }
    };
  
    const handleComment = (postId: number) => {
      handleOpenModal(POST_DETAIL_MODAL);
      setActivePostId(postId);
    };

  return (
    <div key={post.id} className={styles.post}>
    <div className={styles.postHeader}>
      <span className={styles.postAuthor}>by {post.user?.name}</span>
      <span className={styles.postTime}>{formatDistanceToNow(new Date(post.created_at))} ago</span>
    </div>
    <img src={post.image_url} alt="Post" />
    <div className={styles.caption}>{post.caption}</div>
    <div className={styles.likes}>
      <button onClick={() => handleLoveToggle(post.id, loved)} className={`${styles.likeButton} ${loved ? styles.loved : ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.likeIcon}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button> {likeCount}
      <button onClick={() => handleComment(post.id)} className={styles.commentButton}>
        💬
      </button> {post.replies_count}
    </div>
  </div>
  );
};

export default Post;