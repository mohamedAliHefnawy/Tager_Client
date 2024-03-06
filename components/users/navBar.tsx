"use client";

//react
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import linkServer from "@/linkServer";

import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import ModelPasswordMoneyStore from "@/components/users/models/modelPasswordMoneyStore";

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
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
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
import { EyeIcon } from "@/public/svg/eyeIcon";
import { EyeNotIcon } from "@/public/svg/eyeNotIcon";

//images
import Logo from "@/public/img/hbaieb.png";
import CartIcon from "./cart";

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
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(true);
  const [len, setLen] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lengthProductsInCartt, setLengthProductsInCartt] = useState(0);

  const Icons = {
    BarsarrowdownIcon: <BarsarrowdownIcon />,
    UserIcon: <UserIcon />,
    BanknotesIcon: <BanknotesIcon />,
    TagIcon: <TagIcon />,
    LogoutIcon: <LogoutIcon />,
    HeartIcon: <HeartIcon />,
    ShoppingcartIcon: <ShoppingcartIcon />,
    HomeIcon: <HomeIcon />,
    EyeIcon: <EyeIcon />,
    EyeNotIcon: <EyeNotIcon />,
  };

  const Logout = () => {
    localStorage.removeItem("user");
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

  const Login = async () => {
    try {
      const data = {
        name: userr,
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
        router.push("/wallet");
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

  // useEffect(() => {
  //   if (lengthProductsInCart !== 0) {
  //     setLen(lengthProductsInCart);
  //   }
  // }, [lengthProductsInCart]);

  useEffect(() => {
    if (password.trim() !== "") {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [password]);

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
                <p className="flex items-center ">
                  <p className="text-[var(--mainColor)]">{Icons.UserIcon}</p>
                  <Link href="/profile" className="mr-1 text-slate-700">
                    حسابي
                  </Link>
                </p>
              </DropdownItem>
              <DropdownItem key="1">
                {/* {userValidity} */}
                {/* {user} */}
                {userValidity === "مندوب تسويق" && (
                  <p className="flex items-center ">
                    <p className="text-[var(--mainColor)]">
                      {Icons.BanknotesIcon}
                    </p>
                    <p
                      onClick={() => setShowDev(!showDev)}
                      className="mr-1 text-slate-700"
                    >
                      المحفظة
                    </p>
                  </p>
                )}
              </DropdownItem>
              <DropdownItem key="1">
                <p className="flex items-center ">
                  <p className="text-[var(--mainColor)]">{Icons.TagIcon}</p>
                  <Link href="/orders" className="mr-1 text-slate-700">
                    الطلبات
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
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem className="mr-4 mt-5">
            <Link color="foreground" href="/fav">
              {/* <p>{lengthProductsInFavourite}</p> */}
              <span className="text-red-600 mr-3 mt-5">{Icons.HeartIcon}</span>
            </Link>
            {/* {len} */}
          </NavbarItem>
          <NavbarItem className="mr-4 mt-5">
            <Link color="foreground" href="/cart">
              <p className="bg-warning-100 rounded-full flex justify-center items-center text-warning-600">
                {lengthProductsInCart ? lengthProductsInCart : len}
              </p>
              <span className="text-slate-600 mr-3">
                {Icons.ShoppingcartIcon}
              </span>
              {/* {lengthProductsInCart} */}
            </Link>
          </NavbarItem>
          <NavbarItem className="ml-4">
            <Link
              color="foreground"
              href="/"
              className="text-[var(--mainColor)] flex items-center"
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
          {/* <CartIcon
            userr={user}
            lengthProductsInCart={lengthProductsInCart}
            lengthProductsInFavourite={lengthProductsInFavourite}
          /> */}
        </NavbarContent>
        <NavbarMenuToggle
          className="lg:hidden md:hidden max-md:hidden sm:flex max-sm:flex"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />

        <NavbarMenu>
          <NavbarMenuItem className="text-right pr-3 text-lg pt-5">
            <Link href="/" className="flex items-center justify-end mb-6">
              <p className="text-slate-800 mr-2"> الصفحه الرئيسيه </p>
              {Icons.HomeIcon}
            </Link>
            {userValidity === "مندوب تسويق" && (
              <p className="flex items-center justify-end mb-6 text-slate-800">
                <p onClick={() => setShowDev(!showDev)} className=" mr-2">
                  المحفظة
                </p>
                <p className="">{Icons.BanknotesIcon}</p>
              </p>
            )}

            <Link href="/fav" className="flex items-center justify-end mb-6">
              <p className="text-slate-800 mr-2"> المفضلة </p>
              {Icons.HeartIcon}
            </Link>
            <Link href="/cart" className="flex items-center justify-end mb-6">
              <p className="text-slate-800 mr-2"> السلة </p>
              {Icons.ShoppingcartIcon}
            </Link>
            <Link href="/orders" className="flex items-center justify-end mb-6">
              <p className="text-slate-800 mr-2"> الطلبات </p>
              {Icons.TagIcon}
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
        <div
          className={`w-96 h-96 sm:w-[100%] max-sm:w-[100%] sm:mt-16 max-sm:mt-16 rounded-3xl border-1 border-warning-400 p-10 flex flex-col justify-center items-center  z-50 bg-white ${
            showDev ? "absolute top-0 right-0" : "hidden"
          }`}
        >
          <div className="flex justify-between items-center w-[100%]">
            <input
              type={showPassword ? "password" : "text"}
              className="input w-full"
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
            <div>
              <Button className="button" onClick={Login} disabled={check}>
                دخول
              </Button>
            </div>
          </div>
        </div>
        {/* <div className=" bg-red-400 absolute z-50 bottom-0 right-0">12</div> */}
      </Navbar>
    </>
  );
}
