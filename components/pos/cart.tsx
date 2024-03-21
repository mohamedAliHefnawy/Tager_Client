"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

//component
import Icons from "@/iconsSvg";

//images
import Logo from "@/public/img/";

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
  [key: string]: { anchorKey: string };
}

interface AmountData {
  [key: string]: number;
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
  const [selectedSize, setSelectedSize] = React.useState<SizeData>({});
  const [amountProduct, setAmountProduct] = React.useState<AmountData>({});
  const [deduct, setDeduct] = React.useState(0);
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

  const handleSelectionSize = ({ productId, size }: any) => {
    setSelectedSize((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };

  const MinusValueAomunt = (productId: string, newValue: string) => {
    const parsedValue = parseInt(newValue);
    setAmountProduct((prevAmounts) => {
      const newAmount = Math.max(parsedValue, 1);
      return {
        ...prevAmounts,
        [productId]: newAmount,
      };
    });
  };

  const amountAvail = (productId: string) => {
    const amount =
      selectedSize[productId] &&
      allProducts
        .flatMap((item) => item.sizeProduct)
        .flatMap((item2) =>
          item2.store
            .filter(
              (item4) =>
                item4.nameStore === StorePos &&
                item2.size === selectedSize[productId]["anchorKey"]
            )
            .map((item3) => item3.amount)
        );

    const totalAmount = amount.length > 0 ? amount[0] : 0;
    return totalAmount;
  };

  const PlusValueAomunt = (productId: string, newValue: string) => {
    const parsedValue = parseInt(newValue) || 0;
    setAmountProduct((prevAmounts) => {
      const newAmount = Math.min(parsedValue, +amountAvail(productId));
      return {
        ...prevAmounts,
        [productId]: newAmount,
      };
    });
  };

  const DropSize = ({ sizes, productId }: any) => {
    return (
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger>
          <Button variant="bordered" className="h-8 w-10 ">
            {selectedSize[productId]?.anchorKey.toString() || "المقاس"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[
            selectedSize[productId]?.anchorKey.toString() ?? "all",
          ]}
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

  const PriceOrder = allProducts.reduce(
    (cacl, alt) => cacl + alt.priceProduct,
    0
  );

  useEffect(() => {
    if (productsCart) {
      setAllProducts(productsCart);
    }
  }, [productsCart]);

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
          {allProducts.map((item, indexItem) => (
            <div
              className="w-[100%] flex justify-between items-center my-4"
              key={indexItem}
            >
              <Avatar src={item.imageProduct[0]} size="md" />
              <p className="w-[20%] text-center">{item.nameProduct}</p>
              {selectedSize[item.idProduct] ? (
                <p
                  className="hover:cursor-pointer transform transition-transform hover:scale-125"
                  onClick={() =>
                    MinusValueAomunt(
                      item.idProduct,
                      String(amountProduct[item.idProduct] - 1)
                    )
                  }
                >
                  {Icons.MinuscircleIcon}
                </p>
              ) : (
                <p className="opacity-75">{Icons.MinuscircleIcon}</p>
              )}

              <div className="w-28">
                {selectedSize[item.idProduct] ? (
                  <input
                    type=""
                    className="inputTrue2"
                    value={amountProduct[item.idProduct]}
                    onChange={(e) => {
                      const enteredValue = +e.target.value;
                      const availableAmount = amountAvail(item.idProduct);

                      if (enteredValue <= availableAmount) {
                        MinusValueAomunt(
                          item.idProduct,
                          enteredValue.toString()
                        );
                      }
                    }}
                  />
                ) : (
                  <input
                    type=""
                    disabled
                    className="inputTrue2"
                    value={amountProduct[item.idProduct]}
                    onChange={(e) =>
                      MinusValueAomunt(item.idProduct, e.target.value)
                    }
                  />
                )}
              </div>

              {selectedSize[item.idProduct] ? (
                <p
                  className="hover:cursor-pointer transform transition-transform hover:scale-125"
                  onClick={() =>
                    PlusValueAomunt(
                      item.idProduct,
                      String(amountProduct[item.idProduct] + 1)
                    )
                  }
                >
                  {Icons.PlusCircleIcon}
                </p>
              ) : (
                <p className="opacity-75">{Icons.PlusCircleIcon}</p>
              )}

              <DropSize sizes={item.sizeProduct} productId={item.idProduct} />
            </div>
          ))}
          <div className="w-[100%] flex flex-col items-center mt-6 p-4 bg-warning-200 border-1 border-warning-500 ">
            ملخص الطلب
          </div>

          <div className="w-[100%] flex flex-col items-center p-5 ">
            <p className="w-[100%] text-right mt-3 flex justify-end items-center">
              <div className="w-[20%] mr-2">
                <input type="number" className="inputTrue" placeholder="%" />
              </div>
              <span style={{ direction: "rtl" }} className="mb-1">
                خصم |
              </span>
            </p>
            <p className="w-[100%] text-right mt-3">
              <span>سعر المنتجات |</span>
              <span className="mr-3 text-lg">
                <span className="font-bold">{PriceOrder}</span>
                <span className="mr-1">د.ل</span>
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
