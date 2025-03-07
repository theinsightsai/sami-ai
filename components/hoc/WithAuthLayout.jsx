"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

// Project import
import { IMAGES, ROUTE } from "@/constants";
import { FaceBookSvg, AppleSvgIcon, GoogleSvgIcon } from "@/constants/assets";

// Material UI Import
import { CssBaseline, Paper, Box } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  minHeight: "100vh",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const StyledContent = styled(Box)(({ theme }) => ({
  flex: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(8, 4),
  width: "100%",
}));

const TAB_MENU = [
  { label: "Login", identifier: "LOGIN" },
  { label: "Register", identifier: "REGISTER" },
];

const withAuthLayout = (Component) => {
  return function AuthLayoutWrapper(props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = searchParams.get("auth");
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [activeTab, setActiveTab] = useState(
      auth === "register"
        ? TAB_MENU?.[1]?.identifier
        : TAB_MENU?.[0]?.identifier
    );

    useEffect(() => {
      if (isAuthenticated) {
        router.push(ROUTE.DASHBOARD);
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
      return null;
    }

    const handleTabChange = (event, tabValue) => {
      setActiveTab(tabValue);
    };

    return (
      <StyledBox>
        <CssBaseline />
        <div className="bg-black flex justify-center items-center hidden lg:flex lg:flex-[5] xl:flex-[7] ">
          <video
            src={IMAGES.AI_ICON}
            className="h-[60%]"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        <StyledContent
          component={Paper}
          elevation={4}
          className="pt-[58px] justify-start"
        >
          <h1 className="text-xl mt-5 mb-2 font-outfit flex justify-center">
            Welcome to Innovation Scout
          </h1>

          <div className="flex mt-5 p-2 bg-[#C9A9FE] rounded-full">
            {TAB_MENU.map((tab, i, arr) => {
              return (
                <button
                  className={`w-[125px] py-2 px-4 rounded-full text-white transition-colors duration-500 ${
                    activeTab === tab.identifier
                      ? "bg-primary_color"
                      : "bg-transparent"
                  }`}
                  onClick={(event) => handleTabChange(event, tab.identifier)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="w-full h-[65vh] min-h-[65vh] flex items-center justify-center ">
            <Component {...props} activeTab={activeTab} />
          </div>

          <div className="text-[#B5B5B5] mt-1 flex flex-col items-center">
            <div>or continue with</div>
            <div className="mt-1 flex gap-2">
              <FaceBookSvg />
              <AppleSvgIcon />
              <GoogleSvgIcon />
            </div>
          </div>
        </StyledContent>
      </StyledBox>
    );
  };
};

export default withAuthLayout;
