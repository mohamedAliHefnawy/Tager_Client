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
import { Navbar, useDisclosure } from "@nextui-org/react";

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

export default function CartIcon({
  userr,
  lengthProductsInCart,
  lengthProductsInFavourite,
}: {
  userr: any;
  lengthProductsInCart: number;
  lengthProductsInFavourite: number;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const [len, setLen] = useState(0);

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

  return (
    <div className="fixed z-50 bottom-0 right-0 max-lg:hidden lg:hidden md:hidden sm:flex max-sm:flex">
      <p className="absolute z-50 bottom-0 right-0 mr-6 mb-4 bg-warning-500 rounded-full flex justify-center items-center text-white w-6 h-6 ">
        {lengthProductsInCart ? lengthProductsInCart : len}
      </p>
      <Link
        color="foreground"
        href="/cart"
        className="absolute z-40 bottom-0 right-0 mr-6 mb-4 bg-white rounded-full flex justify-center items-center border-2 border-warning-500 p-7 w-10 h-10"
      >
        <span className="text-warning-600">{Icons.ShoppingcartIcon}</span>
      </Link>
    </div>
  );
}
