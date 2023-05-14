import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { getAvatar, getCurrentUser } from "./helper";
import { useAgoraFunctions } from "./agora";

function SidebarChat({
  addNewChat,
  selectedUser,
  setSelectedUser,
  users,
  setUsers,
}) {
  const [lastMessage, setLastMessage] = useState("Last Message...");

  const { getAllUsers } = useAgoraFunctions({});

  const createChat = async () => {
    const userID = prompt("Please enter user ID for chat");
    const currentUser = getCurrentUser();

    if (!userID) {
      return;
    }
    if (userID === currentUser.userID) {
      return alert("Same User entered");
    }

    const res = await getAllUsers();
    console.log(res.entities);
    const users = res.entities;

    const userFoundInList = users.some((user) => user.username === userID);

    if (!userFoundInList) {
      return alert("Unknown user");
    }

    const newUser = {
      userID,
      lastMessage: "",
      avatar: getAvatar(users.length),
    };

    setUsers(users.concat(newUser));
  };

  useEffect(() => {
    if (selectedUser) {
      switch (selectedUser.lastMessage.type) {
        case "video":
          setLastMessage("Video");
          break;
        case "audio":
          setLastMessage("Audio");
          break;
        case "txt":
          setLastMessage(selectedUser.lastMessage.msg);
          break;
        case "file":
          setLastMessage("File");
          break;
        case "img":
          setLastMessage("Image");
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  return !addNewChat ? (
    <div className="sidebarChat" onClick={() => setSelectedUser(selectedUser)}>
      <Avatar src={`https://api.dicebear.com/6.x/${selectedUser.avatar}/svg`} />
      <div className="sidebarChat__info">
        <h2>{selectedUser.userID}</h2>
        <p className="sidebarChat__lastMessage">{lastMessage}</p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
