"use client";

//React
import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

//nextUi
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
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

export default function NavBar() {
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
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
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
          <DropdownMenu style={{ direction: "rtl" }}>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.HomeIcon}</p>
                <Link href="/delivery/mainPage" className="mr-1 text-slate-700">
                  الصفحة الرئيسية
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.BanknotesIcon}</p>
                <Link
                  href="/delivery/moneySafe"
                  className="mr-1 text-slate-700"
                >
                  الخزينه
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.MapIcon}</p>
                <Link href="/delivery/orders" className="mr-1 text-slate-700">
                  الطلبيات
                </Link>
              </p>
            </DropdownItem>
            <DropdownItem key="1">
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">
                  {Icons.BuildingstorefrontIcon}
                </p>
                <Link href="/delivery/store" className="mr-1 text-slate-700">
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
    </>
  );
}
