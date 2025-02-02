import React, { useState } from 'react';
import styles from '@/app/style.module.css';
import { createPost } from './helper/api';

interface CreatePostFormProps {
  onPostCreated;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({onPostCreated }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    const response = await createPost(imageFile, caption)
    .then(response =>{
      onPostCreated(response)
    })
    .catch(err => {

    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="imageFile">Upload Image</label>
        <input
          type="file"
          id="imageFile"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="caption">Caption</label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button className={styles.primaryButton} type="submit">Submit</button>
    </form>
  );
};

export default CreatePostForm;