"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";

//component
import Icons from "@/iconsSvg";

//images
import Logo from "@/public/img/hbaieb.png";

//nextUi
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";

export default function CartPos() {
  const AdminPos = localStorage.getItem("nameAdmin");
  const ValPos = localStorage.getItem("valAdmin");
  const [showDivCart, setShowDivCart] = useState(false);
  const [selectedColor, setSelectedColor] = React.useState(new Set(["اللون "]));
  const [selectedSize, setSelectedSSize] = React.useState(new Set(["الحجم "]));

  const selectedValueColor = React.useMemo(
    () => Array.from(selectedColor).join(", ").replaceAll("_", " "),
    [selectedColor]
  );
  const selectedValueSize = React.useMemo(
    () => Array.from(selectedSize).join(", ").replaceAll("_", " "),
    [selectedSize]
  );
  const handleSelectionColor = (selectedItems: string[]) => {
    setSelectedColor(new Set(selectedItems));
  };
  const handleSelectionSize = (selectedItems: string[]) => {
    setSelectedSSize(new Set(selectedItems));
  };

  const DropColor = () => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="h-8 w-10 ">
            {selectedValueColor}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedColor}
          onSelectionChange={(keys: string[] | any) =>
            handleSelectionColor(keys)
          }
        >
          <DropdownItem key={1}>{1}</DropdownItem>
          {/* {moneySafe.map((item) => (
            <DropdownItem key={item.name}>{item.name}</DropdownItem>
          ))} */}
        </DropdownMenu>
      </Dropdown>
    );
  };
  const DropSize = () => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="h-8 w-10 ">
            {selectedValueSize}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedSize}
          onSelectionChange={(keys: string[] | any) =>
            handleSelectionSize(keys)
          }
        >
          <DropdownItem key={1}>{1}</DropdownItem>
          {/* {moneySafe.map((item) => (
            <DropdownItem key={item.name}>{item.name}</DropdownItem>
          ))} */}
        </DropdownMenu>
      </Dropdown>
    );
  };

  return (
    <>
      <div
        onClick={() => setShowDivCart(true)}
        className="fixed right-0 top-[50%] z-40 bg-warning-100 border-1 border-warning-300 rounded-full p-4 hover:cursor-pointer"
      >
        <p className="rotate-90 text-warning-600">{Icons.ArrowUturnDownIcon}</p>
      </div>

      {showDivCart && (
        <div className="w-[30%] h-screen fixed z-50 right-0 top-0 p-10 pt-5 bg-white shadow-lg flex flex-col items-center">
          <div className="flex justify-between items-center w-[100%]">
            <User
              name={
                <p className="text-black opacity-90  font-medium">
                  <p className="font-bold">{AdminPos}</p>
                  <p className="opacity-70">{ValPos}</p>
                </p>
              }
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                size: "lg",
              }}
            />
            <div className="w-[100%] flex justify-end ">
              <span
                onClick={() => setShowDivCart(false)}
                className="p-4 hover:cursor-pointer text-danger-600"
              >
                ⌧
              </span>
            </div>
          </div>
          <div className="w-[100%] flex justify-center my-3 opacity-70">
            <p>{new Date().toLocaleDateString()}</p>
            <p className="ml-2">{Icons.CalendarDaysIcon}</p>
          </div>
          <div className="w-[100%] flex flex-col items-center mt-6">
            <p className="text-lg font-bold">منتجات الطلبية</p>
          </div>
          <div className="w-[100%] flex justify-between items-center my-4">
            <span className="relative  hover:cursor-pointer text-danger-400">
              ✘
            </span>
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              size="md"
            />
            <p>اسم المنتج</p>
            <p>{Icons.MinuscircleIcon}</p>
            <p>1</p>
            <p>{Icons.PlusCircleIcon}</p>
            {DropColor()}
            {DropSize()}
          </div>
        </div>
      )}
    </>
  );
}
