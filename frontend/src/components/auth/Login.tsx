import React from "react";
import LoginForm from "./LoginForm";
import "./style.css";

export default function Login() {
  return (
    <div className="bg-image">
      <div className="md:container md:mx-auto  h-lvh flex items-center justify-center">
        <div className=" w-1/2 min-w-80 max-w-2xl">
          <h1
            className="text-2xl font-medium text-center p-4 text-white"
            style={{ backgroundColor: "rgb(51, 51, 51)" }}
          >
            SUT Attendence
          </h1>
          <div className="p-5 bg-slate-50">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
