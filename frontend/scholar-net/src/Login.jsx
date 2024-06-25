import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Login.css'
import { auth } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log(userCredential);
    }).catch((error) => {
        console.log(error);
    });

  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="sign-in-container">
        <form onSubmit={signIn}>
            <h1>Log In</h1>
            <input type='email' placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} ></input>
            <input type='password' placeholder='Enter your password' value={password} onChange={(e)=> setPassword(e.target.value)} ></input>
            <button type='submit'>Log In</button>
        </form>

      </div>
    </>
  )
}

export default Login
