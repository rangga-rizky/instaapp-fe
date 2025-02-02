import React, { use, useEffect, useState } from 'react';
import styles from '@/app/PostDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import { Post, Reply, ReplyRequest } from './helper/model';
import { createReply, getPost } from './helper/api';

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
  
  useEffect(() => {
    loadPosts(id);
  }, [id]);
  
  return (
    <div className={styles.repliesContainer}>
      <div className={styles.repliesList}>
        {post?.replies.map(reply => (
          <div key={reply.id} className={styles.replyItem}>
            <div className={styles.replyHeader}>
              <span className={styles.replyUsername}>{reply?.user?.name}</span>
              <span className={styles.replyTime}>{formatDistanceToNow(new Date(reply.created_at))} ago</span>
            </div>
            <div className={styles.replyText}>{reply.message}</div>
          </div>
        ))}
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