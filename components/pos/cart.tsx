"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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

interface SizeData {
  [key: string]: string | undefined;
}

export default function CartPos({
  productsCart,
}: {
  productsCart: {
    idProduct: string;
    nameProduct: string;
    imageProduct: string[];
    sizeProduct: {
      size: string;
      store: { nameStore: string; amount: number }[];
    }[];
    colorProduct: string;
    priceProduct: number;
    catogryProduct: string;
  }[];
}) {
  const AdminPos = localStorage.getItem("nameKasheer");
  const ValPos = localStorage.getItem("valKasheer");
  const StorePos = localStorage.getItem("storeKasheer");
  const MoneySafePos = localStorage.getItem("moneySafeKasheer");

  const [showDivCart, setShowDivCart] = useState(false);
  const [selectedColor, setSelectedColor] = React.useState(new Set(["اللون "]));
  const [selectedSize, setSelectedSize] = React.useState<SizeData>({});
  const [allProducts, setAllProducts] = useState<
    {
      idProduct: string;
      nameProduct: string;
      imageProduct: string[];
      sizeProduct: {
        size: string;
        store: { nameStore: string; amount: number }[];
      }[];
      colorProduct: string;
      priceProduct: number;
      catogryProduct: string;
    }[]
  >([]);

  const [productsCartAlready, setProductsCartAlready] = useState({});

  const selectedValueSize = React.useMemo(
    () => Object.values(productsCartAlready).join(", ").replaceAll("_", " "),
    [productsCartAlready]
  );

  const handleSelectionSize = ({ productId, size }: any) => {
    setSelectedSize((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const DropSize = ({ sizes, productId }: any) => {
    return (
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>
          <Button variant="bordered" className="h-8 w-10 ">
            {selectedSize[productId] || "المقاس"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[selectedSize[productId] ?? "all"]}
          onSelectionChange={(keys) =>
            handleSelectionSize({ productId, size: keys })
          }
          closeOnSelect
        >
          {sizes.map((item: { size: string }) => (
            <DropdownItem key={item.size}>{item.size}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  const RemoveProductWithCart = (idProduct: string) => {
    const filter = allProducts.filter((item) => item.idProduct !== idProduct);
    setAllProducts(filter);
  };

  useEffect(() => {
    if (productsCart) {
      setAllProducts(productsCart);
    }
  }, [productsCart]);

  const size = (id: string) => {
    return selectedSize[id];
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
        <div className="w-[30%] h-screen overflow-y-auto scrollDashbordSideBar fixed z-50 right-0 top-0 p-10 pt-5 bg-white shadow-lg flex flex-col items-center">
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
          {/* {StorePos} */}
          {allProducts.map((item, indexItem) => (
            <div
              className="w-[100%] flex justify-between items-center my-4"
              key={indexItem}
            >
              {/* <span
                className="relative  hover:cursor-pointer text-danger-400"
                onClick={() => RemoveProductWithCart(item.idProduct)}
              >
                ✘
              </span> */}
              <Avatar src={item.imageProduct[0]} size="md" />
              <p className="w-[20%] text-center">{item.nameProduct}</p>
              <p className="hover:cursor-pointer">{Icons.MinuscircleIcon}</p>
              <p>
                {item.sizeProduct
                  .filter(
                    (item2) => item2.size === selectedSize[item.idProduct]
                  )
                  .map(
                    (item2) =>
                      item2.store.find((store) => store.nameStore === StorePos)
                        ?.amount
                  )
                  .join(", ")}
              </p>

              <p className="hover:cursor-pointer">{Icons.PlusCircleIcon}</p>
              <DropSize sizes={item.sizeProduct} productId={item.idProduct} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
