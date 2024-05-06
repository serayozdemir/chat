import React, { useEffect, useState, useContext } from 'react';
import {db} from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp} from 'firebase/firestore';


const StarredMessages = () => {
  const [starredMessages, setStarredMessages] = useState([]);
  const {currentUser} = useContext(AuthContext);
  useEffect(() => {
    // Firestore'dan yıldızlı mesajları almak için bir fonksiyon
    const fetchStarredMessages = async () => {
        
        
      try {
        /* await setDoc(doc(db, "starredMessages"), {
            uid:currentUser.uid,
            name:currentUser.name,
            message:message.text,
            
          }); */
          const docRef = doc(db, "starredMessages");
          const docSnap = await getDoc(docRef);
          console.log(docSnap.data());
       // const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Her belgeyi uygun formata dönüştür
        setStarredMessages(docSnap.data()); // Yıldızlı mesajları state'e kaydet
      } catch (error) {
        console.error('Error fetching starred messages: ', error);
      }
    };

    fetchStarredMessages(); // fetchStarredMessages fonksiyonunu çağır
  }, []); // ComponentDidMount'da yalnızca bir kez çalışacak şekilde boş bağımlılık dizisi kullan

  return (
    <div>
      <h2>Yıldızlı Mesajlar</h2>
      <ul>
        {/* Yıldızlı mesajları listeleyin */}
        {starredMessages.map(message => (
          <li key={message.id}>
            <strong>{message.sender}</strong>: {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StarredMessages;
