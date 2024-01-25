"use client";

//react
import React from "react";
import Image from "next/image";
import Link from "next/link";

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

//svg
import { BarsarrowdownIcon } from "@/public/svg/barsarrowdownIcon";
import { UserIcon } from "@/public/svg/userIcon";
import { BanknotesIcon } from "@/public/svg/banknotesIcon";
import { TagIcon } from "@/public/svg/tagIcon";
import { LogoutIcon } from "@/public/svg/logoutIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { HomeIcon } from "@/public/svg/homeIcon";

//images
import Logo from "@/public/img/hbaieb.png";

export default function NavBar({
  user,
  lengthProductsInCart,
  lengthProductsInFavourite,
}: {
  user: any;
  lengthProductsInCart: number;
  lengthProductsInFavourite: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const Icons = {
    BarsarrowdownIcon: <BarsarrowdownIcon />,
    UserIcon: <UserIcon />,
    BanknotesIcon: <BanknotesIcon />,
    TagIcon: <TagIcon />,
    LogoutIcon: <LogoutIcon />,
    HeartIcon: <HeartIcon />,
    ShoppingcartIcon: <ShoppingcartIcon />,
    HomeIcon: <HomeIcon />,
  };

  return (
    <Navbar position="static">
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
              <p className="flex items-center ">
                <p className="text-[var(--mainColor)]">{Icons.BanknotesIcon}</p>
                <Link href="/wallet" className="mr-1 text-slate-700">
                  المحفظة
                </Link>
              </p>
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
                <p className="mr-1">تسجيل خروج</p>
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className="mr-4">
          <Link color="foreground" href="/fav">
            {/* <Badge
              color="primary"
              content={lengthProductsInFavourite}
              shape="circle"
            >
        </Badge> */}
            <span className="text-red-600 mr-3">{Icons.HeartIcon}</span>
          </Link>
        </NavbarItem>
        <NavbarItem className="mr-4">
          <Link color="foreground" href="/cart">
            {/* <Badge
              color="primary"
              content={lengthProductsInCart}
              shape="circle"
            >
        </Badge> */}
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

      <NavbarMenu>
        <NavbarMenuItem className="text-right pr-3 text-lg pt-5">
          <Link href="/" className="flex items-center justify-end mb-6">
            <p className="text-slate-800 mr-2"> الصفحه الرئيسيه </p>
            {Icons.HomeIcon}
          </Link>
          <Link href="/wallet" className="flex items-center justify-end mb-6">
            <p className="text-slate-800 mr-2"> المحفظة </p>
            {Icons.BanknotesIcon}
          </Link>
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
    </Navbar>
  );
}
