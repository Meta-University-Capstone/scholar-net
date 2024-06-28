import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from "firebase/auth";

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
        <button onClick={userSignOut} >Sign Out</button>
    )
}

export default AuthDetails
