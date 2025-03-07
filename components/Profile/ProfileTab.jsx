"use client";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";

// material-ui
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

// assets
import EditOutlined from "@ant-design/icons/EditOutlined";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import WalletOutlined from "@ant-design/icons/WalletOutlined";

import { ROUTE, ERROR_TEXT, FONT_STYLES } from "@/constants";
import { ToastMessage } from "..";
import { API } from "@/app/api/apiConstant";

const PROFILE_MENU = [
  {
    label: "Edit Profile",
    icon: <EditOutlined />,
    indentifier: "EDIT_PROFILE",
  },
  {
    label: "View Profile",
    icon: <UserOutlined />,
    indentifier: "VIEW_PROFILE",
  },
  {
    label: "Social Profile",
    icon: <ProfileOutlined />,
    indentifier: "SOCIAL_PROFILE",
  },
  { label: "Billing", icon: <WalletOutlined />, indentifier: "BILLING" },
  { label: "Logout", icon: <LogoutOutlined />, indentifier: "LOGOUT" },
];

export default function ProfileTab() {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [postApi, setPostApi] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state?.auth);

  const onLogoutClick = async () => {
    try {
      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }
      const response = await postApi(API.LOGOUT, {
        token: userData?.token,
      });

      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        dispatch(logout());
        localStorage.clear();
        router.push(ROUTE.AUTH);
        ToastMessage("success", response?.data?.message);
      }
    } catch (error) {
      console.log("error==>", error);
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
    }
  };

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
    };

    loadApi();
  }, []);

  const onMenuClick = async (event, menuObj) => {
    setSelectedMenu(menuObj.indentifier);
    if (menuObj.indentifier === "LOGOUT") {
      onLogoutClick();
    }
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
      {PROFILE_MENU.map((menuObj, i, arr) => {
        return (
          <ListItemButton
            key={`${menuObj.indentifier}-${i}`}
            selected={menuObj.indentifier === selectedMenu}
            onClick={(event) => onMenuClick(event, menuObj)}
          >
            <ListItemIcon>{menuObj.icon}</ListItemIcon>
            <div style={{ ...FONT_STYLES }}>{menuObj.label}</div>
          </ListItemButton>
        );
      })}
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
};
