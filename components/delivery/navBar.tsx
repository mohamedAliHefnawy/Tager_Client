"use client";

//React
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icons from "@/iconsSvg";

//nextUi
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

//components
import useCheckLogin from "@/components/delivery/checkLogin/checkLogin";

export default function NavBar() {
  const router = useRouter();
  const [nameDelivery] = useCheckLogin();
  const [nameDeliveryy, setNameDeliveryy] = useState("");

  const Logout = () => {
    localStorage.removeItem("nameDelivery");
    router.push("/delivery");
  };

  useEffect(() => {
    if (nameDelivery) {
      const timeoutId = setTimeout(() => {
        setNameDeliveryy(nameDelivery);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [nameDelivery]);

  return (
    <>
      <div className="w-[100%] h-32 bg-[var(--mainColor)] flex justify-end items-end pb-10 rounded-es-3xl rounded-ee-3xl">
        <Dropdown closeOnSelect={false}>
          <DropdownTrigger>
            <Button
              className="text-white bg-[var(--mainColor)]"
              startContent={Icons.ChevrondownIcon}
            >
              <p className="text-white flex" style={{ direction: "rtl" }}>
                <span>مرحباَ بك</span>
                <span className="mr-1">{nameDelivery}</span>
              </p>
            </Button>
          </DropdownTrigger>
          <DropdownMenu style={{ direction: "rtl" }}>
            <DropdownItem
              key="1"
              onClick={() => router.push("/delivery/mainPage")}
            >
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.HomeIcon}</p>
                <p className="mr-1 text-slate-700">الصفحة الرئيسية</p>
              </p>
            </DropdownItem>
            <DropdownItem
              key="2"
              onClick={() => router.push("/delivery/moneySafe")}
            >
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.BanknotesIcon}</p>
                <p className="mr-1 text-slate-700">الخزينه</p>
              </p>
            </DropdownItem>
            <DropdownItem
              key="3"
              onClick={() => router.push("/delivery/orders")}
            >
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.MapIcon}</p>
                <p className="mr-1 text-slate-700">الطلبيات</p>
              </p>
            </DropdownItem>
            <DropdownItem
              key="4"
              onClick={() => router.push("/delivery/store")}
            >
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">
                  {Icons.BuildingstorefrontIcon}
                </p>
                <p className="mr-1 text-slate-700">المخزن</p>
              </p>
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onClick={() => Logout()}
            >
              <p className="flex items-center ">
                <p>{Icons.LogoutIcon}</p>
                <p className="mr-1">تسجيل خروج</p>
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
