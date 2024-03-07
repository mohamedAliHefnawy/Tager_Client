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
        <Dropdown>
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
