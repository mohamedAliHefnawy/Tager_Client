"use client";

//React
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

//nextUi
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
  Textarea,
} from "@nextui-org/react";

//svg
import { BarsarrowdownIcon } from "@/public/svg/barsarrowdownIcon";
import { UserIcon } from "@/public/svg/userIcon";
import { BanknotesIcon } from "@/public/svg/banknotesIcon";
import { TagIcon } from "@/public/svg/tagIcon";
import { LogoutIcon } from "@/public/svg/logoutIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { HomeIcon } from "@/public/svg/homeIcon";
import { ChevrondownIcon } from "@/public/svg/chevrondownIcon";
import { MapIcon } from "@/public/svg/mapIcon";
import { BuildingstorefrontIcon } from "@/public/svg/buildingstorefrontIcon";

//images
import Logo from "@/public/img/hbaieb.png";

//components
import NavBar from "@/components/delivery/navBar";

export default function Home({ params }: { params: { slug: string } }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [check, setCheck] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordConfirn, setShowPasswordConfirn] = useState(true);
  const router = useRouter();

  const Icons = {
    BarsarrowdownIcon: <BarsarrowdownIcon />,
    UserIcon: <UserIcon />,
    BanknotesIcon: <BanknotesIcon />,
    TagIcon: <TagIcon />,
    LogoutIcon: <LogoutIcon />,
    HeartIcon: <HeartIcon />,
    ShoppingcartIcon: <ShoppingcartIcon />,
    HomeIcon: <HomeIcon />,
    ChevrondownIcon: <ChevrondownIcon />,
    MapIcon: <MapIcon />,
    BuildingstorefrontIcon: <BuildingstorefrontIcon />,
  };

  const SignUp = async () => {
    try {
      const data = {
        name,
        phone,
        password,
      };
      const response = await axios.post(
        "https://tager-server.vercel.app/users/signUp",
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
        localStorage.setItem("user", name);
        router.push("/");
      }
      if (response.data === "no") {
        Swal.fire({
          icon: "warning",
          title: "هذا الإسم مستخدم من قبل ",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
      if (response.data === "error") {
        Swal.fire({
          icon: "error",
          title: "توجد مشكلة ما. حاول مرة أخرى ",
          text: "😓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Logout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <>
      <NavBar />
      <div className="mt-4">
        <div className="p-6 pb-1 pt-0 text-right">
          <Link
            href={`/delivery/orders/dsfr4`}
            className="text-warning-600 underline"
          >
            طلبيه أستاذ محمد <span className="text-[13px]">(الاربع عذب)</span>
          </Link>
        </div>
        <div className="mb-2 p-6 pt-0 px-3 w-[100%]">
          <div className="w-[100%] h-auto border-1 border-slate-400 text-center rounded-2xl p-4 gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4  sm:grid-cols-2">
            <div className="flex bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl  ">
              <p className="text-right text-[12px] mr-1">
                <span className=""> ساعة سمارات (3) </span>
                <p className="flex justify-between">
                  <span className="text-[12px] text-success-700 flex justify-end">
                    <span className="mr-1">د.ل</span>
                    <span>200</span>
                  </span>
                  <span className="text-[12px]"> 128GB </span>
                </p>
              </p>
              <p>
                <Avatar src={`${Logo}`} size="sm" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
