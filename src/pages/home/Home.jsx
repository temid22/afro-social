import '../../style.scss';
import { Sidebar, Chat } from '../../components';
import { useSidebarContext } from '../../context/SidebarContext';

import { useEffect } from 'react';

const Home = () => {
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    setMenuDisplay,
    setScreenSize,
  } = useSidebarContext();

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
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
  return (
    <div className='home'>
      <div className='container'>
        {activeMenu && <Sidebar />}
        <Chat />
      </div>
    </div>
  );
};

export default Home;
