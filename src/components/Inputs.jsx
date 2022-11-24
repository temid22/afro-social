import { AddPhotoAlternateOutlined, Send } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ChatContext from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import InputEmoji from 'react-input-emoji';
import { useSidebarContext } from '../context/SidebarContext';

const Inputs = () => {
  const [isHover2, setIsHover2] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    menuDisplay,
    setMenuDisplay,
    setScreenSize,
  } = useSidebarContext();

  const handleMouseEnter2 = () => {
    setIsHover2(true);
  };
  const handleMouseLeave2 = () => {
    setIsHover2(false);
  };

  const hover2Style = {
    cursor: 'pointer',
    color: isHover2 ? 'rgb(222, 221, 221)' : '#999',
    transition: '0.5s ease',
  };
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    if (screenSize >= 900) {
      setMenuDisplay(false);
    } else {
      setMenuDisplay(true);
    }
  }, [screenSize]);
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
          setErr(true);
          const message = error.response?.message;
          console.log(message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      if (text !== '') {
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setText('');
    setImg(null);
  };

  return (
    <>
      <form onSubmit={handleSend}>
        <div className='input'>
          {err && <span>Something went wrong...</span>}

          <InputEmoji
            value={text}
            onChange={setText}
            placeholder='Message'
            borderRadius='10px'
            theme='dark'
          />

          {/* <input
              type='text'
              placeholder='Message'
              onChange={(e) => setText(e.target.value)}
              value={text}
            /> */}

          <div className='send'>
            <input
              type='file'
              style={{ display: 'none' }}
              id='file'
              onChange={(e) => setImg(e.target.files[0])}
            />
            <label htmlFor='file'>
              <AddPhotoAlternateOutlined
                style={hover2Style}
                onMouseEnter={handleMouseEnter2}
                onMouseLeave={handleMouseLeave2}
              />
            </label>
            <button>
              <Send />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Inputs;
