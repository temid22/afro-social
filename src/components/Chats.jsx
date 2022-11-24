import { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useSidebarContext } from '../context/SidebarContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const { activeMenu, setActiveMenu, screenSize } = useSidebarContext();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  return (
    <div className='chats'>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className='userChat'
            key={chat[0]}
            onClick={() => handleCloseSideBar(handleSelect(chat[1].userInfo))}
          >
            <img
              src={
                chat[1].userInfo?.photoURL ||
                'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
              }
              alt=''
            ></img>
            <div className='userChatInfo'>
              <span>{chat[1].userInfo?.displayName}</span>
              <p>{chat[1].lastMessage?.text?.slice(0, 20)}...</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
