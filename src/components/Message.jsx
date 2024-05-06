import React, { useContext, useState, useEffect, useRef  } from 'react';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {db} from '../firebase';
import { addDoc, collection, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';


const Message = ({message}) => {
  const [checked, setChecked] = useState(false); 

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Mesajın gönderildiği zamanı al
  const messageTime = message.sentAt.toDate(); // 'sentAt' mesajın gönderildiği tarih nesnesini içerir

// Şu anki zamanı al
  const now = new Date();

// İki zaman arasındaki farkı hesapla (milisaniye cinsinden)
  const timeDiff = now.getTime() - messageTime.getTime();

// Farkı dakika cinsine çevir
  const minutesAgo = Math.floor(timeDiff / (1000 * 60));

// Eğer mesaj 1 dakikadan önce gönderilmişse "just now" yerine dakika olarak göster
  const timeDisplay = minutesAgo < 1 ? "just now" : `${minutesAgo} minutes ago`;


  const handleToggleStar = async () => {
    try {
      if (!checked) {
        // Yıldızlı mesajı Firestore'a ekle
        await addDoc(collection(db, 'starredMessages'), {
          uid: currentUser.uid,
          name: data.user?.name,
          message: message.text,
          
        });
      } else {
        // Yıldızlı mesajı Firestore'dan silme
        const q = query(collection(db, 'starredMessages'), where('uid', '==', currentUser.uid), where('name', '==', currentUser.name), where('message', '==', message.text));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }
      setChecked(!checked);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className='messageContent'>
        <div className='heart'>
          <HeartSwitch
            size="sm"
            inactiveTrackFillColor="#cffafe"
            inactiveTrackStrokeColor="#22d3ee"
            activeTrackFillColor="#06b6d4"
            activeTrackStrokeColor="#0891b2"
            inactiveThumbColor="#ecfeff"
            activeThumbColor="#ecfeff"
            checked={checked}
            onChange={handleToggleStar}
          /> 
          <p>{message.text}</p>
          {message.img && <img src={message.img} alt="" />}
        </div>
      </div>
    </div>
  )
}

export default Message