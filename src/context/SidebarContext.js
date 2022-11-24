import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [menuDisplay, setMenuDisplay] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        activeMenu,
        screenSize,
        setScreenSize,
        setActiveMenu,
        menuDisplay,
        setMenuDisplay,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
export const useSidebarContext = () => useContext(SidebarContext);
