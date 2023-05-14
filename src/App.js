import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { getAvatar } from "./helper";
import Login from "./Login";
import { useAgoraFunctions } from "./agora";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { retrieveConversations } = useAgoraFunctions({});

  const fetchAllUsers = async () => {
    const res = await retrieveConversations();

    let newUsers = [];
    const reg = /(?<=_).*?(?=@)/;

    for (let i = 0; i < res.data.channel_infos.length; i++) {
      const val = res.data.channel_infos[i];
      const channelID = val.channel_id;
      const userID = channelID.match(reg)[0];
      const lastMessage = val.lastMessage;

      newUsers.push({ userID, lastMessage, avatar: getAvatar(i) });
    }
    setUsers(newUsers);
    setSelectedUser(newUsers[0]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    // BEM naming convention
    <div className="App">
      {isLoggedIn ? (
        <div className="app__body">
          <Sidebar
            users={users}
            setUsers={setUsers}
            setSelectedUser={setSelectedUser}
          />
          <Chat selectedUser={selectedUser} />
        </div>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
};

export default App;
