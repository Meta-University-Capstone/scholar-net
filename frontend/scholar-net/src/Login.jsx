import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Login.css'
import { auth } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import AuthDetails from './AuthDetails';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const firebaseUserId = userCredential.user.uid;
        const userEmail = userCredential.user.email;
        navigate("/")
        console.log(userEmail);
        console.log(firebaseUserId);
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
      <p>Don't have an account?</p>
      <Link to={`/register`}>
        <p>Register</p>
      </Link>
      <AuthDetails/>
    </>
  )
}

export default Login
