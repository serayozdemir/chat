import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import {createUserWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth, db, storage } from '../firebase';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc} from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${name + date}`);

      await uploadBytesResumable(storageRef, file);

      // Diğer işlemler
      const downloadURL = await getDownloadURL(storageRef);

      // Update profile
      await updateProfile(res.user, {
        name: name,
        photoURL: downloadURL,
      });

      // Firestore'a kullanıcıyı oluştur
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name,
        email,
        photoURL: downloadURL,
      });

      // Firestore'a kullanıcının sohbetlerini oluştur
      await setDoc(doc(db, "userChats", res.user.uid), {});

      // Anasayfaya yönlendir
      navigate("/");
    } catch (err) {
      console.error(err);
      setErr(true);
      setLoading(false);
    }
  };


  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">Real-time Chat</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='name'/>
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
                <input style={{display:'none'}} type='file' id='file'/>
                <label htmlFor='file'>
                    <img src={Add} alt=''/>
                    <span>Add a profile picture!</span>
                </label>
                <button>Sign Up</button>
                {loading && "Uploading and compressing the image please wait..."}
                {err && <span>Something went wrong!</span>}
            </form>
            <p>You already have an account? <Link to='/login'>Login</Link> </p>
        </div>
    </div>
    
  )
}

export default Register;