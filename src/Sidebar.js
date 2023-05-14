import React from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import { DonutLarge, SearchOutlined } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SidebarChat from "./SidebarChat.js";

function Sidebar({ users, setUsers, setSelectedUser }) {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat={true} users={users} setUsers={setUsers} />

        {users.map((user) => (
          <SidebarChat
            key={user.userID}
            selectedUser={user}
            setSelectedUser={setSelectedUser}
            users={users}
            setUsers={setUsers}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
