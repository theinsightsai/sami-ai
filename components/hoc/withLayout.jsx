"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SideBar from "../sideBar";
import { ROUTE } from "../../constants/index";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const withLayout = (WrappedComponent) => {
  return (props) => {
    const isLoading = useSelector((state) => state.loader.loading);

    return (
      <AuthWrapper>
        <Backdrop
          sx={(theme) => ({
            color: "#005B96",
            zIndex: 100000000,
          })}
          open={isLoading}
        >
          <CircularProgress color="#005B96" />
        </Backdrop>
        <div className="flex min-h-screen">
          <SideBar />
          <div className="flex-1 bg-gray-100 p-6 text-black overflow-y-auto pt-[100px] max-h-screen">
            <WrappedComponent {...props} />
          </div>
        </div>
      </AuthWrapper>
    );
  };
};

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state?.auth?.isAuthenticated);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(ROUTE.AUTH);
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return children;
};

export default withLayout;
