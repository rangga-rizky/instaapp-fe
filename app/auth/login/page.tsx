'use client';

import styles from '@/app/auth/login/style.module.css';
import ErrorMessage from '@/components/ErrorMessage';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { LoginRequest } from "@/app/helper/model";
import { login } from '@/app/helper/api';


export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const req: LoginRequest = { 
      email : email,
      password : password
    };

    const response = await login(req)
    .then(response =>{
      localStorage.setItem('token', response.access_token)
      router.push('/');
    })
    .catch(err => {
      setError(err.response.data.message);
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
      <h2 className={styles.title}>Login</h2>
      <form className={styles.form}>
        <input
          type="text"
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
        <p className={styles.register}>didnt have account yet? here <b><a href="/auth/register">register</a></b> </p>
        <button onClick={handleLogin}>Login</button>
      </form>
      {error!='' && <ErrorMessage message={error} />}
    </div>
  );
}