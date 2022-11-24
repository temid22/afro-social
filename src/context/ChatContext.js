import { createContext, useContext, useReducer } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };
  const chatReducer = (state, { type, payload }) => {
    switch (type) {
      case 'CHANGE_USER':
        return {
          user: payload,
          chatId:
            currentUser?.uid > payload?.uid
              ? currentUser?.uid + payload?.uid
              : payload?.uid + currentUser?.uid,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
