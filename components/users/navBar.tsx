"use client";

//react
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

//nextUi
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";

//images
import Logo from "@/public/img/hbaieb.png";

export default function NavBar({
  userr,
  lengthProductsInCart,
  lengthProductsInFavourite,
}: {
  userr: any;
  lengthProductsInCart: number;
  lengthProductsInFavourite: number;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const [user, userValidity] = useCheckLogin();
  const [showDev, setShowDev] = useState(false);
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [len, setLen] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lengthProductsInCartt, setLengthProductsInCartt] = useState(0);

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userWallet");
    router.push("/auth/login");
  };

  const GetProductsInCart = useCallback(async () => {
    try {
      let response: {
        data: { token: string; combinedProducts: any; combinedProducts2: any };
      };
      response = await axios.get(
        `${linkServer.link}cart/getProductsInCart/${user}`,

        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setLen(response.data.combinedProducts.length);
    } catch (error) {
      console.log(error);
    }
  }, [user, secretKey]);

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user, GetProductsInCart]);

  useEffect(() => {
    const fetchLengthProductsInCart = async () => {
      const updatedLength = len;
      if (updatedLength !== 0) {
        setLengthProductsInCartt(updatedLength);
      }
      setInitialLoad(false);
    };

    fetchLengthProductsInCart();
  }, []);

  useEffect(() => {
    if (password.trim() !== "") {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [password]);

  const DeleteWalletSign = () => {
    localStorage.removeItem("userWallet");
  };

  return (
    <>
      <Navbar className="bg-white">
        <NavbarBrand>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                color="warning"
                startContent={Icons.BarsarrowdownIcon}
              >
                <p className="text-slate-800" style={{ direction: "rtl" }}>
                  مرحباَ بك {user}
                </p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              style={{ direction: "rtl" }}
              className="border-1 bg-[var(--mainColorRgba)] rounded-lg"
            >
              <DropdownItem key="1">
                <Link
                  href="/profile"
                  className="flex items-center "
                  onClick={DeleteWalletSign}
                >
                  <p className="text-[var(--mainColor)]">{Icons.UserIcon}</p>
                  <Link href="/profile" className="mr-1 text-slate-700">
                    حسابي
                  </Link>
                </Link>
              </DropdownItem>
              <DropdownItem key="1">
                {userValidity === "مندوب تسويق" && (
                  <Link href="/wallet" className="flex items-center ">
                    <p className="text-[var(--mainColor)]">
                      {Icons.BanknotesIcon}
                    </p>
                    <Link href="/wallet" className="mr-1 text-slate-700">
                      المحفظة
                    </Link>
                  </Link>
                )}
              </DropdownItem>
              <DropdownItem key="1">
                <Link
                  href="/orders"
                  className="flex items-center "
                  onClick={DeleteWalletSign}
                >
                  <p className="text-[var(--mainColor)]">{Icons.TagIcon}</p>
                  <Link href="/orders" className="mr-1 text-slate-700">
                    الطلبات
                  </Link>
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger">
                <p onClick={() => Logout()} className="flex items-center ">
                  <p>{Icons.LogoutIcon}</p>
                  <p onClick={() => Logout()} className="mr-1">
                    تسجيل خروج
                  </p>
                </p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem className="mr-4 mt-5">
            <Link color="foreground" href="/fav" onClick={DeleteWalletSign}>
              <span className="text-red-600 mr-3 mt-5">{Icons.HeartIcon}</span>
            </Link>
          </NavbarItem>
          <NavbarItem className="mr-4 mt-5">
            <Link color="foreground" href="/cart" onClick={DeleteWalletSign}>
              <p className="bg-warning-100 rounded-full flex justify-center items-center text-warning-600">
                {lengthProductsInCart ? lengthProductsInCart : len}
              </p>
              <span className="text-slate-600 mr-3">
                {Icons.ShoppingcartIcon}
              </span>
            </Link>
          </NavbarItem>
          <NavbarItem className="ml-4">
            <Link
              color="foreground"
              href="/"
              className="text-[var(--mainColor)] flex items-center"
              onClick={DeleteWalletSign}
            >
              <p>الصفحة الرئيسيه</p>
              <p> {Icons.HomeIcon}</p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="lg:flex md:flex max-md:flex sm:hidden max-sm:hidden">
            <Image src={Logo} width={100} height={100} alt={"error"} />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenuToggle
          className="lg:hidden md:hidden max-md:hidden sm:flex max-sm:flex"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />

        <NavbarMenu className="absolute z-50">
          <NavbarMenuItem className="text-right pr-3 text-lg pt-5">
            <Link
              href="/"
              className="flex items-center justify-end mb-6"
              onClick={DeleteWalletSign}
            >
              <p className="text-slate-800 mr-2"> الصفحه الرئيسيه </p>
              {Icons.HomeIcon}
            </Link>
            {userValidity === "مندوب تسويق" && (
              <Link
                href="wallet"
                // className="flex items-center justify-end mb-6"
              >
                <p className="flex items-center justify-end mb-6 text-slate-800">
                  <p className="mr-2">المحفظة</p>
                  <p className="">{Icons.BanknotesIcon}</p>
                </p>
              </Link>
            )}

            <Link
              href="/fav"
              className="flex items-center justify-end mb-6"
              onClick={DeleteWalletSign}
            >
              <p className="text-slate-800 mr-2"> المفضلة </p>
              {Icons.HeartIcon}
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-end mb-6"
              onClick={DeleteWalletSign}
            >
              <p className="text-slate-800 mr-2"> السلة </p>
              {Icons.ShoppingcartIcon}
            </Link>
            <Link
              href="/orders"
              className="flex items-center justify-end mb-6"
              onClick={DeleteWalletSign}
            >
              <p className="text-slate-800 mr-2"> الطلبات </p>
              {Icons.TagIcon}
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
        <div
          className={`w-96 h-96 sm:w-[100%] max-sm:w-[100%] sm:mt-16 max-sm:mt-16 rounded-3xl border-1 border-warning-400 p-10 flex flex-col justify-center items-center  z-50 bg-white ${
            showDev ? "absolute top-0 right-0" : "hidden"
          }`}
        ></div>
      </Navbar>
    </>
  );
}
