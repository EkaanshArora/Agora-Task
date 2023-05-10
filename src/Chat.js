import React, { useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';

function Chat() {
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

  const [input, setInput] = useState('');
  const sendMessage = (e) => {
    e.preventDefault();
    console.log('You typed >>> ', input);
    setInput('');
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://api.dicebear.com/6.x/${getAvatar()}/svg`} />
        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        <p className={`chat__message ${true && 'chat__receiver'}`}>
          <span className="chat__name">Hoimanti Dutta</span>
          Hey Guys!
          <span className="chat__timestamp">19:56pm</span>
        </p>
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
