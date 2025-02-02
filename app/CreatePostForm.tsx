import React, { useState } from 'react';
import styles from '@/app/style.module.css';

interface CreatePostFormProps {}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageFile(null);
    setCaption('');
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