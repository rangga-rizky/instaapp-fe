import React, { useState } from 'react';
import styles from '@/app/PostDetail.module.css';
import { formatDistanceToNow } from 'date-fns';

const mockPost = {
  id: 2,
  name: 'Jane Smith',
  created_at: new Date().toISOString(),
  image_url: 'https://via.placeholder.com/150',
  replies: [
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 4, user: {name: 'Dave'}, message: 'Love it!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
    { id: 3, user: {name: 'Charlie'}, message: 'Awesome!', created_at: new Date().toISOString() },
  ]
};

interface PostDetailProps {

}

const PostDetail: React.FC<PostDetailProps> = ({ }) => {
  const [newReply, setNewReply] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewReply('');
  };

  return (
    <div className={styles.repliesContainer}>
      <div className={styles.repliesList}>
        {mockPost.replies.map(reply => (
          <div key={reply.id} className={styles.replyItem}>
            <div className={styles.replyHeader}>
              <span className={styles.replyUsername}>{reply.user.name}</span>
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