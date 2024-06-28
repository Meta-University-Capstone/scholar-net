import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Login.css'
import { auth } from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const firebaseUserId = userCredential.user.uid;
            const userEmail = userCredential.user.email;
            const userData = {
                uid: firebaseUserId,
                email: userEmail
            };
            fetch('http://localhost:3000/user/:uid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                navigate("/user/:uid/")
                return response.json();
            })
            .catch(error => {
                console.error('Error sending user data to server:', error);
            });

        }).catch((error) => {
            console.log('Error creating user:', error);
        });
    }






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
        <form onSubmit={register}>
            <h1>Create an Account</h1>
            <input type='email' placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} ></input>
            <input type='password' placeholder='Enter your password' value={password} onChange={(e)=> setPassword(e.target.value)} ></input>
            <button type='submit'>Register</button>
        </form>
      </div>
      <p>Already have an account?</p>
      <Link to={`/login`}>
        <p>Login</p>
      </Link>
    </>
  )
}

export default Register
