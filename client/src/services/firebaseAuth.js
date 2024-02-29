// firebaseAuth.js

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase-config";



const signUp = async (username,email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);


        console.log("new user", userCredential)
        return userCredential.user;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Signin error:', error);
        throw error;
    }
}

const signInWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
    } catch (error) {
        console.error('Signin with Google error:', error);
        throw error;
    }
}

const logout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

const checkAuthState = (setUser) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
            // console.log("User is signed in", user);
        } else {
            setUser(null);
        }
    });

    return unsubscribe;
};

const updateUserInfo = async (newDisplayName) => {
    const user = auth.currentUser;

    try {
        // Update the user's profile information
        await updateProfile(user, {
            displayName: newDisplayName
            // photoURL: "https://images.unsplash.com/photo-1682688759157-57988e10ffa8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        });

        // Reload the user to get the updated information
        await user.reload();

        // Optionally, you can also fetch the updated user profile
        const updatedUser = auth.currentUser;

        console.log("User profile updated:", updatedUser);
    } catch (error) {
        console.error('Update user info error:', error.message);
        throw error;
    }
};

export { signUp, signIn, logout, checkAuthState, updateUserInfo, signInWithGoogle };
