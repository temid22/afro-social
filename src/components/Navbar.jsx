import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className='navbar'>
      <span className='logo'>Afro Social</span>
      <div className='user'>
        <img
          src={
            currentUser.photoURL ||
            'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
          }
          alt='avatar'
        />
        <span style={{ fontSize: 12, marginTop: 5 }}>
          {currentUser.displayName}
        </span>
        {currentUser && <button onClick={() => signOut(auth)}>Logout</button>}
      </div>
    </div>
  );
};

export default Navbar;
