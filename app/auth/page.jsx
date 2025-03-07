"use client";
import { Fragment } from "react";
import WithAuthLayout from "@/components/hoc/WithAuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = ({ activeTab }) => {
  return (
    <Fragment>
      {activeTab === "LOGIN" ? <LoginForm /> : <RegisterForm />}
    </Fragment>
  );
};
export default WithAuthLayout(Auth);
