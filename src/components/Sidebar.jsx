import { Search, Navbar, Chats } from './';

const Sidebar = () => {
  return (
    <>
      <div className='sidebar'>
        <Navbar />
        <Search />
        <Chats />
      </div>
    </>
  );
};

export default Sidebar;
