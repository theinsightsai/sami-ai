"use client";
import { useState } from "react";

// material-ui
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

// assets
import {
  CommentOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { FONT_STYLES } from "@/constants";

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const MENU = [
  { icon: <QuestionCircleOutlined />, label: "Support", identifier: "SUPPORT" },
  {
    icon: <UserOutlined />,
    label: "Account Settings",
    identifier: "ACCOUNT_SETTING",
  },
  {
    icon: <LockOutlined />,
    label: "Privacy Center",
    identifier: "PRIVACY_CENTER",
  },
  { icon: <CommentOutlined />, label: "Feedback", identifier: "FEEDBACK" },
  { icon: <UnorderedListOutlined />, label: "History", identifier: "HISTORY" },
];

export default function SettingTab() {
  const [selectedMenu, setSelectedMenu] = useState(0);

  const handleListItemClick = (event, identifier) => {
    setSelectedMenu(identifier);
  };

  return (
    <List
      component="nav"
      sx={{
        p: 0,
        "& .MuiListItemIcon-root": { minWidth: 32 },
        paddingTop: "7px",
        paddingBottom: "7px",
      }}
    >
      {MENU.map((menuObj, i, arr) => {
        return (
          <ListItemButton
            selected={selectedMenu === menuObj.identifier}
            onClick={(event) => handleListItemClick(event, menuObj.identifier)}
            key={`${menuObj.label}-${i}`}
          >
            <ListItemIcon>{menuObj.icon}</ListItemIcon>
            <div style={{ ...FONT_STYLES }}>{menuObj.label}</div>
          </ListItemButton>
        );
      })}
    </List>
  );
}
