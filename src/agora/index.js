import AC from 'agora-chat';
import { useState } from 'react';
import { getCurrentUser, getRandomString } from '../helper';

const appKey = '61963677#1125634';

const connection = new AC.connection({
  appKey: appKey,
});

// export let isUserConnected = false;

export const useAgoraFunctions = ({ onMessageReceiveCallback }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);

  connection.addEventHandler('connection&message', {
    onConnected: () => {
      console.log('"Connect success !"');
      setIsUserConnected(true);
    },
    onDisconnected: () => {
      console.log('Logout success !');
    },
    onTextMessage: (message) => {
      console.log('onTextMessage ', message);
      onMessageReceiveCallback?.();
    },
    onAudioMessage: (message) => {
      console.log('OnAudioMessage ', message);
      onMessageReceiveCallback?.();
    },
    onVideoMessage: (message) => {
      console.log('onVideoMessage ', message);
      onMessageReceiveCallback?.();
    },
    onFileMessage: (message) => {
      console.log('onFileMessage ', message);
      onMessageReceiveCallback?.();
    },
    onImageMessage: (message) => {
      console.log('onImageMessage ', message);
      onMessageReceiveCallback?.();
    },
    onTokenWillExpire: () => {
      console.log('Token is about to expire ');
    },
    onTokenExpired: () => {
      console.log('The token has expired ');
    },
    onError: (error) => {
      console.error('on error', error);
    },
  });

  const getRequest = async ({ url }) => {
    return await fetch(url, {
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer 007eJxTYFho6eqodV35j8nErvWfb75/UvQxSnL9Nr13HpppRc7bH4cqMKSZGRulWqSZpRgappmYm6QlmhskmxunpJhbmhgnWSYb3zyakNIQyMgQk1jEzMjAysDIwMQA4jMwAAD9gR9B',
      },
      method: 'GET',
    });
  };

  const postRequest = async ({ url, body }) => {
    return await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer 007eJxTYFho6eqodV35j8nErvWfb75/UvQxSnL9Nr13HpppRc7bH4cqMKSZGRulWqSZpRgappmYm6QlmhskmxunpJhbmhgnWSYb3zyakNIQyMgQk1jEzMjAysDIwMQA4jMwAAD9gR9B',
      },
      method: 'POST',
    });
  };

  const register = async ({ userID, pwd }) => {
    const res = await postRequest({
      url: 'http://a61.easemob.com/61963677/1125634/users',
      body: { username: userID, password: pwd },
    });

    return await res.json();
  };

  const login = ({ userId, pwd }) => {
    return (window.onload = async () => {
      return await connection.open({
        user: userId,
        pwd,
      });
    });
  };

  const logout = () => connection.close();

  const getAllUsers = async () => {
    const res = await getRequest({
      url: 'http://a61.easemob.com/61963677/1125634/users',
    });
    return await res.json();
  };

  const sendTextMessage = async ({ peerId, peerMessage }) => {
    const option = {
      chatType: 'singleChat',
      type: 'txt',
      to: peerId,
      msg: peerMessage,
    };
    const msg = AC.message.create(option);
    return await connection.send(msg);
  };

  const sendMediaMessage = async ({ userID, blob, fileType }) => {
    try {
      const file = {
        url: AC.utils.parseDownloadResponse.call(AC.connection, blob),
        filename: `${getRandomString(10)}.${fileType}`,
        filetype: fileType,
        data: blob,
        length: '3',
        duration: '3',
      };
      const currentUser = getCurrentUser();

      const imageTypes = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
      const videoTypes = ['mp4', 'wmv', 'avi', 'rmvb', 'mkv'];
      const documentTypes = ['zip', 'txt', 'doc', 'pdf'];
      const audioTypes = ['mp3', 'amr', 'wmv', 'mpeg'];

      let option = {};
      if (imageTypes.some((val) => file.filetype.toLowerCase().includes(val))) {
        option = { type: 'img' };
      } else if (
        audioTypes.some((val) => file.filetype.toLowerCase().includes(val))
      ) {
        option = { type: 'audio', length: '3' };
      } else if (
        videoTypes.some((val) => file.filetype.toLowerCase().includes(val))
      ) {
        option = { type: 'video' };
      } else if (
        documentTypes.some((val) => file.filetype.toLowerCase().includes(val))
      ) {
        option = { type: 'file' };
      }

      option = {
        ...option,
        file,
        filename: file.filename,
        to: userID,
        from: currentUser.userID,
        chatType: 'singleChat',
        onFileUploadError: () => console.log('onFileUploadError'),
        onFileUploadProgress: (e) => console.log(e),
        onFileUploadComplete: (data) =>
          console.log('onFileUploadComplete ', data),
        ext: {
          file_length: file.data.size,
        },
      };

      const msg = AC.message.create(option);
      return await connection.send(msg);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  const retrieveConversations = async () => {
    const conversations = await connection.getConversationlist();
    return conversations;
  };

  const retrieveMessages = async ({ userId }) => {
    if (isUserConnected) {
      const options = { targetId: userId, cursor: -1, searchDirection: 'down' };
      const messages = await connection.getHistoryMessages(options);
      return messages;
    } else {
      return undefined;
    }
  };

  return {
    isUserConnected,
    setIsUserConnected,
    register,
    login,
    logout,
    getAllUsers,
    sendTextMessage,
    sendMediaMessage,
    retrieveConversations,
    retrieveMessages,
  };
};
