import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, SearchOutlined } from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useAgoraFunctions } from './agora';
import { downloadFile, getCurrentUser } from './helper';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

function Chat({ selectedUser }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState();
  const [currentUser, setCurrentUser] = useState();

  const recorderControls = useAudioRecorder();
  const fileTextInputRef = useRef(null);

  const getMessages = async () => {
    if (selectedUser && isUserConnected) {
      const fetchedMessages = await retrieveMessages({
        userId: selectedUser.userID,
      });
      if (fetchedMessages) {
        console.log('fetchedMessages', fetchedMessages);
        setMessages(fetchedMessages.messages);
      } else {
        console.error('FAILED TO GET MESSAGES');
      }
    }
  };

  const {
    isUserConnected,
    retrieveMessages,
    sendTextMessage,
    sendMediaMessage,
    retrieveConversations,
  } = useAgoraFunctions({ onMessageReceiveCallback: getMessages });

  const sendMessage = async (e) => {
    e.preventDefault();
    const res = await sendTextMessage({
      peerId: selectedUser.userID,
      peerMessage: input,
    });
    if (res.serverMsgId && res.localMsgId) {
      getMessages();
    } else {
      alert('Unable to send message');
    }
    setInput('');
  };

  const addAudioElement = async (blob) => {
    const res = await sendMediaMessage({
      userID: selectedUser.userID,
      blob,
      fileType: 'mp3',
    });
    if (res.localMsgId && res.serverMsgId) {
      getMessages();
    } else {
      alert('Unable to send message');
    }
  };

  const handleFileSelected = async (e) => {
    const files = Array.from(e.target.files);
    const file = files[0];

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });

    const res = await sendMediaMessage({
      userID: selectedUser.userID,
      blob,
      fileType: file.type,
    });
    if (res.localMsgId && res.serverMsgId) {
      getMessages();
    } else {
      alert('Unable to send message');
    }
  };

  useEffect(() => {
    getMessages();

    const user = getCurrentUser();
    setCurrentUser(user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, isUserConnected]);

  useEffect(() => {
    retrieveConversations()
      .then((val) => {
        console.log('Connections', val);
      })
      .catch((err) => console.error(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        {selectedUser ? (
          <Avatar
            src={`https://api.dicebear.com/6.x/${selectedUser.avatar}/svg`}
          />
        ) : null}
        <div className="chat__headerInfo">
          {selectedUser ? <h3>{selectedUser.userID}</h3> : null}
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton onClick={() => fileTextInputRef.current.click()}>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages
          ? messages.map((message) => {
              const isMessageFromMe = message.from === currentUser.userID;
              const time = new Date(message.time * 1000);
              var options = {
                weekday: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              };
              var formattedTime = time.toLocaleTimeString('en-us', options);

              if (message.type === 'audio') {
                return (
                  <p
                    className={`chat__message ${
                      isMessageFromMe && 'chat__receiver'
                    }`}
                    key={message.id}
                  >
                    <audio src={message.url} controls />
                    <span className="chat__timestamp">{formattedTime}</span>
                  </p>
                );
              } else if (message.type === 'video') {
                return (
                  <p
                    className={`chat__message ${
                      isMessageFromMe && 'chat__receiver'
                    }`}
                    key={message.id}
                  >
                    <video src={message.url} controls />
                    <span className="chat__timestamp">{formattedTime}</span>
                  </p>
                );
              } else if (message.type === 'img') {
                return (
                  <p
                    className={`chat__message ${
                      isMessageFromMe && 'chat__receiver'
                    }`}
                    key={message.id}
                  >
                    <img
                      src={message.url}
                      alt="message.url"
                      height={100}
                      width={200}
                    />
                    <span className="chat__timestamp">{formattedTime}</span>
                  </p>
                );
              } else if (message.type === 'file') {
                return (
                  <div
                    className={`chat__message ${
                      isMessageFromMe && 'chat__receiver'
                    }`}
                    key={message.id}
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        downloadFile({ url: message.url });
                      }}
                      href={message.url}
                    >
                      {message.url.substring(0, 30)}...
                    </a>
                    <span className="chat__timestamp">{formattedTime}</span>
                  </div>
                );
              } else {
                return (
                  <p
                    className={`chat__message ${
                      isMessageFromMe && 'chat__receiver'
                    }`}
                    key={message.id}
                  >
                    {message.msg}
                    <span className="chat__timestamp">{formattedTime}</span>
                  </p>
                );
              }
            })
          : null}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={({ target }) => setInput(target.value)}
            placeholder="Type a message"
            type="text"
            id="inputMessage"
          />
          <AudioRecorder
            onRecordingComplete={addAudioElement}
            downloadFileExtension="mp3"
            recorderControls={recorderControls}
            classes={{ AudioRecorderClass: 'chat__mic' }}
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <input
          type="file"
          id="mediaInput"
          ref={fileTextInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelected}
          multiple={false}
        />
      </div>
    </div>
  );
}

export default Chat;
