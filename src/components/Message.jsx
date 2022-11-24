import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const date = new Date(message.date.seconds * 1000).toLocaleTimeString();

  return (
    <>
      <div
        ref={ref}
        className={`message ${
          message.senderId === currentUser?.uid && 'owner'
        }`}
      >
        <div className='messageInfo'></div>
        <div className='messageContent'>
          <p>
            {message.text}
            <span
              style={{
                fontSize: 10,
                margin: 15,
                color: '#999',
                alignItems: 'flex-end',
              }}
            >
              {date}
            </span>
          </p>
          {message.img && <img src={message.img} alt='' />}
        </div>
      </div>
    </>
  );
};

export default Message;
