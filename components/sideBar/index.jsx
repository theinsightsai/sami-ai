"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Menu,
  Badge,
  MenuItem,
} from "@mui/material";
import { IMAGES, ROUTE, ROLE_ID_BY_NAME, PRIMARY_COLOR } from "@/constants";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/Upload";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PrintIcon from "@mui/icons-material/Print";
import TaskIcon from "@mui/icons-material/Task";
import FeedIcon from "@mui/icons-material/Feed";
import MailIcon from "@mui/icons-material/Mail";
import GroupIcon from "@mui/icons-material/Group";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Profile from "@/components/Profile";

const drawerWidth = 240;

const SETTING_MENU = [
  { label: "Profile", identifier: "PROFILE", route: "" },
  { label: "Account", identifier: "ACCOUNT", route: "" },
  { label: "Dashboard", identifier: "DASHBOARD", route: ROUTE.DASHBOARD },
  { label: "Logout", identifier: "LOGOUT", route: ROUTE.AUTH },
];

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const role_id = useSelector((state) => state?.auth?.role_id);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onMenuClick = (event, identifier, route) => {
    if (identifier === "LOGOUT") {
      toast.success("Logout successfuly");
      router.push(route);
    } else {
      router.push(route);
    }
  };

  const SIDE_BAR_MENU = [
    {
      label: "Home",
      route: ROUTE.DASHBOARD,
      icon: <HomeIcon />,
      isVisible: true,
    },
    {
      label: "Logs",
      route: ROUTE.LOGS,
      icon: <FeedIcon />,
      isVisible: role_id === ROLE_ID_BY_NAME.ADMIN,
    },
    {
      label: "Task Management",
      route: ROUTE.TASK_MANAGEMENT,
      icon: <TaskIcon />,
      isVisible:
        role_id === ROLE_ID_BY_NAME.ADMIN || role_id === ROLE_ID_BY_NAME.TEAM,
    },
    {
      label: "User Management",
      route: ROUTE.USER_MANAGEMENT,
      icon: <GroupIcon />,
      isVisible:
        role_id === ROLE_ID_BY_NAME.ADMIN || role_id === ROLE_ID_BY_NAME.TEAM,
    },
    {
      label: "Team Management",
      route: ROUTE.TEAM_MANAGEMENT,
      icon: <Diversity3Icon />,
      isVisible:
        role_id === ROLE_ID_BY_NAME.ADMIN || role_id === ROLE_ID_BY_NAME.TEAM,
    },
    {
      label: "Role Management",
      route: ROUTE.ROLE_MANAGEMENT,
      icon: <ManageAccountsIcon />,
      isVisible: role_id === ROLE_ID_BY_NAME.ADMIN,
    },
  ];

  const drawer = (
    <div>
      <div className="py-4 flex justify-center">
        <img src={IMAGES.LOGO} style={{ width: "70%" }} />
      </div>
      <Divider />
      <List>
        {SIDE_BAR_MENU.map((menuObj, index) => (
          <ListItem
            onClick={() => router.push(menuObj.route)}
            key={`${menuObj?.label}-${index}`}
            disablePadding
            sx={{
              background: pathname === menuObj.route && PRIMARY_COLOR,
              color: pathname === menuObj.route && "white",
              borderRadius: "0px 15px 15px 0px",
              display: menuObj?.isVisible ? "flex" : "none",
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{ color: pathname === menuObj.route ? "white" : "black" }}
              >
                {menuObj?.icon}
              </ListItemIcon>
              <div>{menuObj?.label}</div>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        style={{ background: PRIMARY_COLOR }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: {
              xs: "space-between",
              sm: "space-between",
              md: "flex-end",
            },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {SETTING_MENU.map((setting, index) => (
                <MenuItem
                  key={`${setting}-${index}`}
                  onClick={(event) =>
                    onMenuClick(event, setting.identifier, setting.route)
                  }
                >
                  <div className="font-outfit">{setting.label}</div>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Tooltip title="Notification">
            <Badge
              badgeContent={4}
              color="primary"
              className="mr-7 cursor-pointer"
            >
              <MailIcon color="action" sx={{ color: "white" }} />
            </Badge>
          </Tooltip>

          <Tooltip title="Open settings">
            <Profile />
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <div className="h-screen border-r-4 border-[#005B96]">{drawer}</div>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

// {
//   label: "Upload Data",
//   route: ROUTE.UPLOAD_DATA,
//   icon: <UploadIcon />,
//   isVisible: true,
// },
// {
//   label: "Run Analysis",
//   route: ROUTE.ANALYSIS,
//   icon: <AnalyticsIcon />,
//   isVisible: true,
// },
// {
//   label: "Results",
//   route: ROUTE.RESULTS,
//   icon: <PrintIcon />,
//   isVisible: true,
// },
