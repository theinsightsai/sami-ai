"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FONT_STYLES,
  IMAGES,
  ROUTE,
  LANDING_PAGE_BG,
  PRIMARY_COLOR,
} from "@/constants";
import Link from "next/link";

const NAVBAR_MENU = [
  { label: "PRICING", route: "" },
  { label: "CONTACT", route: "" },
  { label: "KNOW MORE", route: "" },
  { label: "LOGIN", route: ROUTE.AUTH },
  { label: "REGISTER", route: `${ROUTE.AUTH}?auth=register` },
];

const drawerWidth = 240;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const mobileDrawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        height: "100vh",
        borderRight: `5px solid ${PRIMARY_COLOR}`,
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1,
          display: { xs: "flex", sm: "none" },
          // justifyContent: "center",
        }}
        style={{
          padding: "15px 10px",
          color: "black",
          fontWeight: 500,
          lineHeight: "37.95px",
          ...FONT_STYLES,
        }}
      >
        Innovative Scout
        {/* <img
          src={IMAGES.LOGO}
          alt="insight-ai"
          style={{
            width: "70%",
            padding: "20px 0px",
          }}
        /> */}
      </Typography>
      <Divider />
      <List>
        {NAVBAR_MENU.map((menuObj, i) => (
          <Link href={menuObj.route} key={`${menuObj.label}-${i}`}>
            <ListItem disablePadding>
              <ListItemButton>
                <div style={{ fontFamily: "Outfit, sans-serif" }}>
                  {menuObj.label}
                </div>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        style={{
          background: LANDING_PAGE_BG,
          padding: "5px 0px ",
          transition: "transform 1s ease-in-out",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          display: "flex",
          alignItems: "center",
        }}
        position="fixed"
        className={`transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Toolbar
          sx={{ width: { xs: "90%", sm: "80%" } }}
          style={{ padding: "0px 0px" }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
            }}
            style={{
              color: "black",
              fontWeight: 500,
              lineHeight: "37.95px",
              ...FONT_STYLES,
            }}
          >
            Innovative Scout
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { sm: "none" },
              color: PRIMARY_COLOR,
              justifyContent: "end",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}
            style={{
              color: "black",
              fontWeight: 500,
              lineHeight: "37.95px",
              ...FONT_STYLES,
            }}
          >
            Innovative Scout
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {NAVBAR_MENU.map((menuObj, i, arr) => {
              return (
                <Link
                  key={`${menuObj.label}-${i}`}
                  href={menuObj.route}
                  className="text-black font-medium cursor-pointer hover:text-primary_color mr-7"
                >
                  {menuObj.label}
                </Link>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
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
          {mobileDrawer}
        </Drawer>
      </nav>
    </Box>
  );
};
export default Navbar;
