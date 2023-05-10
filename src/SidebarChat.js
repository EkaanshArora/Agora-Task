import React from 'react';
import './SidebarChat.css';
import { Avatar } from '@material-ui/core';

function SidebarChat({ addNewChat }) {
  function getAvatar() {
    const items = [
      'lorelei',
      'micah',
      // eslint-disable-next-line
      'avataaars',
      'personas',
      'open-peeps',
      // eslint-disable-next-line
      'notionists',
      // eslint-disable-next-line
      'miniavs',
      'adventurer',
      'big-ears',
      'big-smile',
    ];
    const item = items[Math.floor(Math.random() * items.length)];
    return item;
  }

  const createChat = () => {
    const roomName = prompt('Please enter name for chat');

    if (roomName) {
      // do some clever stuff
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Avatar src={`https://api.dicebear.com/6.x/${getAvatar()}/svg`} />
      <div className="sidebarChat__info">
        <h2>Room Name</h2>
        <p>Last Message...</p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
