import { useContext, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { SearchOutlined } from '@mui/icons-material';
const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    //check if the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername('');
  };

  return (
    <div className='search'>
      <div className='searchForm'>
        <input
          type='text'
          placeholder='find friends'
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
        <SearchOutlined
          style={{
            position: 'absolute',
            right: 0,
            color: '#fff',
            cursor: 'pointer',
          }}
          onClick={handleSearch}
        />
      </div>
      {err && <span>No Result</span>}
      {user && (
        <div className='userChat' onClick={handleSelect}>
          <img
            src={
              user.photoURL ||
              'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
            }
            alt=''
          ></img>
          <div className='userChatInfo'>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
