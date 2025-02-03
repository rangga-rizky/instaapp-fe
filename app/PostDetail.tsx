import React, { use, useEffect, useState } from 'react';
import styles from '@/app/PostDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import { Post, ReplyRequest } from './helper/model';
import { createReply, getPost, like, unlike } from './helper/api';
import { REPLY_RESOURCE_TYPE } from './constant';

interface PostDetailProps {
  id: number
}

const PostDetail: React.FC<PostDetailProps> = ({id}) => {
  const [post, setPost] = useState<Post>();
  const [newReply, setNewReply] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const req: ReplyRequest = { 
      message: newReply,
      post_id: id
    };
    const response = await createReply(req)
    .then(response =>{
      post?.replies.push(response);
      setNewReply("")
    })
  };

  const loadPosts = async (id) => {
    const response = await getPost(id)
    .then(response =>{
      setPost(response)
    })
  };

  const handleLoveToggle = async (replyId: number, isLiked: boolean) => {
    if (isLiked) { 
      const response = await unlike(REPLY_RESOURCE_TYPE, replyId)
      .then(response =>{
        loadPosts(id);
      })
    } else {
      const response = await like(REPLY_RESOURCE_TYPE, replyId)
      .then(response =>{
        loadPosts(id);
      })
    }
  };
  
  useEffect(() => {
    loadPosts(id);
  }, [id]);
  
  return (
    <div className={styles.repliesContainer}>
      <div className={styles.repliesList}>
        {post?.replies.length === 0 ? (
          <div className={styles.emptyState}>No replies yet. Be the first to reply!</div>
        ) : (
          post?.replies.map(reply => (
            <div key={reply.id} className={styles.replyItem}>
              <div className={styles.replyHeader}>
                <span className={styles.replyUsername}>{reply?.user?.name}</span>
                <span className={styles.replyTime}>{formatDistanceToNow(new Date(reply.created_at))} ago</span>
              </div>
              <div className={styles.replyText}>
                {reply.message}
                <button onClick={() => handleLoveToggle(reply.id, reply.is_liked_by_user)} className={`${styles.likeButton} ${reply.is_liked_by_user ? styles.loved : ''}`}>
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 24 24"
                   fill="currentColor"
                   className={styles.likeIcon}
                 >
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                 </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.replyForm}>
        <input
          type="text"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          className={styles.replyInput}
          placeholder="Write a reply..."
          required
        />
        <button type="submit" className={styles.replyButton}>Reply</button>
      </form>
    </div>
  );
};

export default PostDetail;