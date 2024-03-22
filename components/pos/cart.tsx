"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ReactToPrint } from "react-to-print";
import PrintInvoice from "@/components/pos/printInvoice";

//component
import Icons from "@/iconsSvg";

//images
import Logo from "@/public/hbaieb.png";

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

  const AdminPos = localStorage.getItem("nameKasheer") as string;
  const ValPos = localStorage.getItem("valKasheer");
  const StorePos = localStorage.getItem("storeKasheer") as string;
  const MoneySafePos = localStorage.getItem("moneySafeKasheer") as string;
  const phoneCompaneyPos = localStorage.getItem("phoneCompanyKasheer");
  const colorCompanyPos = localStorage.getItem("colorCompanyKasheer");

  const [showDivCart, setShowDivCart] = useState(false);
  const [selectedSize, setSelectedSize] = React.useState<SizeData>({});
  const [amountProduct, setAmountProduct] = React.useState<AmountData>({});
  const [deduct, setDeduct] = React.useState<Number>(0);
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
      const newAmount = Math.max(parsedValue, 0);
      return {
        ...prevAmounts,
        [productId]: newAmount,
      };
    });
  };

  const amountAvail = (productId: string, sizeProduct: any) => {
    const amounts = sizeProduct
      .filter(
        (item2: {
          size: string;
          store: { nameStore: string; amount: number }[];
        }) =>
          item2.size === selectedSize[productId]["anchorKey"] &&
          item2.store.some(
            (item3: { nameStore: string }) => item3.nameStore === StorePos
          )
      )
      .map((item: { store: { nameStore: string; amount: number }[] }) => {
        const store = item.store.find(
          (item3: { nameStore: string }) => item3.nameStore === StorePos
        );
        return store ? store.amount : 0;
      });

    const totalAmount = amounts.length > 0 ? amounts[0] : 0;
    return totalAmount;
  };

  const PlusValueAomunt = (
    productId: string,
    sizeProduct: any,
    newValue: string
  ) => {
    const parsedValue = parseInt(newValue) || 0;
    setAmountProduct((prevAmounts) => {
      const newAmount = Math.min(
        parsedValue,
        +amountAvail(productId, sizeProduct)
      );
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
    (cacl, alt) =>
      cacl + alt.priceProduct * (amountProduct[alt.idProduct] || 0),
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
                  {phoneCompaneyPos}
                  {colorCompanyPos}
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
                    style={{
                      border: `1px solid ${
                        amountAvail(item.idProduct, item.sizeProduct) === 0
                          ? "red"
                          : "#D9BB67"
                      }`,
                    }}
                    value={amountProduct[item.idProduct]}
                    onChange={(e) => {
                      const enteredValue = +e.target.value;
                      const availableAmount = amountAvail(
                        item.idProduct,
                        item.sizeProduct
                      );

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
                      item.sizeProduct,
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
                <input
                  type="number"
                  className="inputTrue"
                  placeholder="%"
                  value={+deduct}
                  onChange={(e) => {
                    if (+e.target.value >= 0 && +e.target.value <= 100) {
                      setDeduct(+e.target.value);
                    }
                  }}
                />
              </div>
              <span style={{ direction: "rtl" }} className="mb-1">
                خصم |
              </span>
            </p>
            <p className="w-[100%] text-right mt-3">
              <span>سعر المنتجات |</span>
              <span className="mr-3 text-lg">
                <span className="font-bold">
                  {PriceOrder - (PriceOrder * +deduct) / 100}
                </span>
                <span className="mr-1">د.ل</span>
              </span>
            </p>
          </div>
          <div className="flex justify-between w-[100%] p-4 mt-5">
            <p className="bg-warning-200 border-1 border-warning-600  p-8 w-[31%] flex justify-center items-center hover:cursor-pointer">
              {MoneySafePos}
            </p>
            <p className="bg-warning-200 border-1  p-8 w-[31%] text-center hover:cursor-pointer">
              بنك مصرفي
            </p>
            <p className="bg-warning-200 border-1  p-8 w-[31%] flex justify-center items-center hover:cursor-pointer">
              بيبال
            </p>
          </div>

          <PrintInvoice
            products={allProducts}
            colorCompany={colorCompanyPos}
            phoneCompany={phoneCompaneyPos}
            amount={amountProduct}
            size={selectedSize as SizeData}
            deduct={deduct}
            store={StorePos}
            moneySafe={MoneySafePos}
            pos={AdminPos}
          />
        </div>
      )}
    </>
  );
}
