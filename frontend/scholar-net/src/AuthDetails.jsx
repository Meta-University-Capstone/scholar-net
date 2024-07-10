import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link } from "react-router-dom";


const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null)


    useEffect(() =>{
        const listen = onAuthStateChanged(auth, (user) => {
            if (user){
                setAuthUser(user)
            } else{
                setAuthUser(null)
            }
        } )

        return () => {
            listen()
        }
    }, [])

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful')
        }).catch(error => console.log(error))
    }

    return (
        <Link to="/login" onClick={userSignOut}>
            <button>Sign Out</button>
        </Link>
    )
}

export default AuthDetails
