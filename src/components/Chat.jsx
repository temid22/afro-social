import {
  Videocam,
  PersonAddAltOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import { Messages, Inputs } from './';
import { ChatContext } from '../context/ChatContext';
import { useContext, useEffect } from 'react';
import { useSidebarContext } from '../context/SidebarContext';
import { Cancel, Menu } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const Chat = () => {
  const { data } = useContext(ChatContext);
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    menuDisplay,
    setMenuDisplay,
    setScreenSize,
  } = useSidebarContext();
  const NavButton = ({ title, customFunc, icon }) => (
    <Tooltip title={title} position='BottomCenter'>
      <button
        type='button'
        onClick={() => customFunc()}
        style={{
          color: 'rgb(79, 195, 195)',
          position: 'relative',
          backgroundColor: 'transparent',
          fontSize: 2,
          cursor: 'pointer',
          border: 'none',
          borderRadius: 50,
          outline: 'none',
        }}
        className='item'
      >
        <span
          style={{ position: 'absolute', display: 'inline-flex' }}
          className='dis'
        />
        {icon}
      </button>
    </Tooltip>
  );

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  useEffect(() => {
    if (screenSize >= 900) {
      setMenuDisplay(false);
    } else {
      setMenuDisplay(true);
    }
  }, [screenSize, setMenuDisplay]);
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);
  return (
    <div className='chat'>
      <div className='chatInfo'>
        {menuDisplay && (
          <>
            {!activeMenu ? (
              <NavButton
                title='menu'
                customFunc={handleActiveMenu}
                icon={<Menu />}
              />
            ) : (
              <NavButton
                title='close'
                customFunc={handleActiveMenu}
                icon={<Cancel style={{ color: '#999' }} />}
              />
            )}
          </>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
          }}
        >
          <img
            style={{
              height: 25,
              width: 25,
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            src={data.user?.photoURL}
            alt=''
          />
          <span style={{ marginLeft: 8 }}>{data.user?.displayName}</span>
        </div>
        <div className='chatIcons'>
          <Videocam
            style={{
              color: '#999',
              cursor: 'pointer',
            }}
          />
          <PersonAddAltOutlined
            style={{
              color: 'teal',
              cursor: 'pointer',
            }}
          />
          <MoreHorizOutlined
            style={{
              color: '#FFF',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      <Messages />
      <Inputs />
    </div>
  );
};

export default Chat;
