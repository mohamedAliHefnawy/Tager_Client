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

export default function Home() {
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
      <div className="w-[100%] h-32 bg-[var(--mainColor)] flex justify-end items-end pb-10 rounded-es-3xl rounded-ee-3xl">
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="text-white bg-[var(--mainColor)]"
              startContent={Icons.ChevrondownIcon}
            >
              <p className="text-white" style={{ direction: "rtl" }}>
                مرحباَ بك محمد علي
              </p>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            style={{ direction: "rtl" }}
            // className="border-1 bg-[var(--mainColorRgba)] rounded-lg"
          >
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.BanknotesIcon}</p>
                <Link href="/profile" className="mr-1 text-slate-700">
                  الخزينه
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.MapIcon}</p>
                <Link href="/wallet" className="mr-1 text-slate-700">
                  الطلبيات
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">
                  {Icons.BuildingstorefrontIcon}
                </p>
                <Link href="/orders" className="mr-1 text-slate-700">
                  المخزن
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="logout" className="text-danger" color="danger">
              <p className="flex items-center ">
                <p>{Icons.LogoutIcon}</p>
                <p onClick={() => Logout()} className="mr-1">
                  تسجيل خروج
                </p>
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="my-6">
        <Image src={Logo} alt={"error"} className="w-[100%] h-36" />
      </div>
      <div className="p-3 text-end">
        <p className="opacity-80 text-xl">أحدث 3 طلبات</p>
        <div className="mt-4 flex justify-between items-start">
          <p>تم الإستلام</p>
          <div className="flex justify-end items-start">
            <p>
              <p className="mr-2">ساعه سمارات </p>
              <p className="mr-2 text-sm" style={{ direction: "rtl" }}>
                +3 منتجات أخري
              </p>
            </p>
            <Avatar src={`${Logo}`} size="md" />
          </div>
        </div>
      </div>
    </>
  );
}
