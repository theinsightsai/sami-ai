"use client";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import CardContent from "@mui/material/CardContent";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";

// project import
import ProfileTab from "@/components/Profile/ProfileTab";
import SettingTab from "@/components/Profile/SettingTab";
import Transitions from "@/components/Transitions";
import MainCard from "@/components/cards/Maincard";
import { geTypeByRoleId } from "@/utils";

// assets
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import ToastMessage from "@/components/ToastMessage";
import { ERROR_TEXT, FONT_STYLES } from "@/constants";
import { ROUTE } from "@/constants/index";
import { API } from "@/app/api/apiConstant";

const TAB = [
  {
    label: "Profile",
    icon: <UserOutlined style={{ marginBottom: 0, marginRight: "10px" }} />,
  },
  {
    label: "Setting",
    icon: <SettingOutlined style={{ marginBottom: 0, marginRight: "10px" }} />,
  },
];

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const userData = useSelector((state) => state.auth);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [postApi, setPostApi] = useState(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ p: 0.5 }}
        >
          <Avatar
            alt="profile user"
            src={"https://picsum.photos/200"}
            size="sm"
          />
          <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
            <div style={{ ...FONT_STYLES }}>{userData.user.name}</div>
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position="top-right"
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={{ width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          <Avatar
                            alt="profile user"
                            src={"https://picsum.photos/200"}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Stack>
                            <Typography
                              variant="h6"
                              className="capitalize"
                              style={{ ...FONT_STYLES }}
                            >
                              {userData.user.name}
                              <span className="text-sm font-medium ml-1">
                                ({geTypeByRoleId(userData?.role_id)})
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              style={{ ...FONT_STYLES }}
                            >
                              {userData.user.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton
                            size="large"
                            sx={{ color: "text.primary" }}
                            onClick={onLogoutClick}
                          >
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="profile tabs"
                    >
                      {TAB.map((tab, i, arr) => {
                        return (
                          <Tab
                            key={`${tab.label}-${i}`}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              textTransform: "capitalize",
                              ...FONT_STYLES,
                            }}
                            icon={tab.icon}
                            label={tab.label}
                            {...a11yProps(i)}
                          />
                        );
                      })}
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number,
  other: PropTypes.any,
};
