'use client';

import styles from '@/app/auth/register/style.module.css';
import ErrorMessage from '@//components/ErrorMessage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RegisterRequest } from '@/app/helper/model';
import { registerUser } from '@/app/helper/api';

export default function Page() {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();


  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setLoading(true)
    const req: RegisterRequest = { 
      email : email,
      password : password,
      name : username
    };

    const response = await registerUser(req)
    .then(response =>{
      setLoading(false)
      setSuccess(true)
    })
    .catch(err => {
      setLoading(false)
      const errMessage = Object.keys(err.response.data).map(key => err.response.data[key]).join(', ')
      setError(errMessage);
    });
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (error != '') {
        const timer = setTimeout(() => {
            setError('');
        }, 3000); 
        return () => clearTimeout(timer);
    }
}, [error]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register here!</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>Register</button>
      </form>
      
      {success!='' && <p>Registration success. <b><a href="/auth/login">Login</a></b> </p>}
      {error!='' && <ErrorMessage message={error} />}
    </div>
  );
}