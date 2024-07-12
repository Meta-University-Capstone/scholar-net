import { useState } from 'react'
import './Login.css'
import { auth } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
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
    }).catch((error) => {
        console.log(error);
    });

  };

  return (
    <>
      <div className='login-body'>
          <img src='/public/applogo.png' className="logo"/>
      </div>
      <div className="sign-in-container">
        <form onSubmit={signIn}>
            <h1>LOGIN</h1>
            <input type='email' placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} ></input>
            <input type='password' placeholder='Enter your password' value={password} onChange={(e)=> setPassword(e.target.value)} ></input>
            <button type='submit'>LOGIN</button>
        </form>
      </div>
      <div className='login-footer'>
      <p>Don't have an account?</p>
      <Link to={`/register`}>
        <p>Register</p>
      </Link>
      </div>
    </>
  )
}

export default Login
