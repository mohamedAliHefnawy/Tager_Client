"use client";

import React, { useState } from "react";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import useCheckLogin from "./checkLogin";
import Swal from "sweetalert2";
import axios from "axios";

//nextUi
import { Button } from "@nextui-org/react";

export default function DivCheckWallet(props: any) {
  const [user, userValidity] = useCheckLogin();
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");

  const Login = async () => {
    try {
      const data = {
        name: user,
        password,
      };
      const response = await axios.post(
        `${linkServer.link}users/loginMoneySafe`,
        data
      );

      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم  التسجيل بنجاح ",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        localStorage.setItem("userWallet", user);
        window.location.reload();
      }
      if (response.data === "no") {
        Swal.fire({
          icon: "warning",
          title: "كلمة المرور خاطئة",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-[100%] h-screen">
      <div className="flex justify-center w-[90%]">
        <input
          type={showPassword ? "password" : "text"}
          className="input"
          placeholder="أدخل الباسورد"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="relative bg-red-400">
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-0 flex items-center pr-4  pt-3 text-[var(--mainColor)] hover:cursor-pointer`}
          >
            {showPassword ? Icons.EyeIcon : Icons.EyeNotIcon}
          </span>
        </span>
        <div className="pt-1">
          <Button
            className="button mt-2 border-1 border-warning-400 outline-1 outline-warning-400 ml-2"
            onClick={Login}
            // disabled={check}
          >
            دخول
          </Button>
        </div>
      </div>
    </div>
  );
}
