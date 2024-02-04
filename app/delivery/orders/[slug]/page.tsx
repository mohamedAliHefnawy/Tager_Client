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
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";

//images
import Logo from "@/public/img/hbaieb.png";

//components
import NavBar from "@/components/delivery/navBar";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [check, setCheck] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordConfirn, setShowPasswordConfirn] = useState(true);
  const router = useRouter();
  const [selectedKeyCategory, setSelectedKeyCategory] = React.useState<
    string[]
  >(["تغيير حالة الطلبية"]);

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
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
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

  const selectedValueCategory = React.useMemo(
    () => Array.from(selectedKeyCategory).join(", ").replaceAll("_", " "),
    [selectedKeyCategory]
  );
  const handleSelectionChangeCategory = (selectedItems: string[]) => {
    setSelectedKeyCategory(selectedItems);
  };

  return (
    <>
      <NavBar />
      <div className="mt-4">
        <div className="p-6 pb-1 pt-0 text-right">
          <p>
            <span className="flex justify-end text-[14px] mb-2">
              <span className="mr-1">محمد</span>
              <span className="opacity-80"> : الإسم </span>
            </span>
            <span className="flex justify-end text-[14px] mb-2">
              <span className="mr-1">1212619708</span>
              <span className="opacity-80"> : الهاتف 1 </span>
            </span>
            <span className="flex justify-end text-[14px] mb-2">
              <span className="mr-1">1022595631</span>
              <span className="opacity-80"> : الهاتف 2 </span>
            </span>
            <span className="flex justify-end text-[14px] mb-2">
              <span className="mr-1">البحيره ابو حمص مركز دمنهور</span>
              <span className="opacity-80"> : العنوان </span>
            </span>
            <span className="flex justify-end text-[14px] mb-2">
              <span className="mr-1">مع الشحن</span>
              <span className="opacity-80"> : الحالة </span>
            </span>
          </p>
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
        <div className="px-3">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                color="warning"
                startContent={Icons.ArrowUturnDownIcon}
                className="w-[100%]"
              >
                {selectedValueCategory}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              color="warning"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeyCategory}
              onSelectionChange={(keys: string[] | any) =>
                handleSelectionChangeCategory(keys)
              }
            >
              <DropdownItem key="تم التسليم">
                <p className="text-center">تم التسليم</p>
              </DropdownItem>
              <DropdownItem key="تم الإسترجاع">
                <p className="text-center">تم الإسترجاع</p>
              </DropdownItem>
              <DropdownItem key="إسترجاع جزئي">
                <p className="text-center">إسترجاع جزئي</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className="flex justify-end">
            <p className="bg-warning-200 text-slate-600 p-3 px-6 mt-4 rounded-3xl w-[100%] text-center">
              تغيير الحالة
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
