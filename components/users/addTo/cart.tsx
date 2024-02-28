//react
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

//svg
import { BackwardIcon } from "@/public/svg/backwardIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";

export default function ButtonAddToCart({
  id,
  size,
  index,
  updateParent,
}: {
  id: any;
  size: any;
  index: any;
  updateParent: any;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user] = useCheckLogin();
  const [loading, setLoading] = useState(true);
  const [len, setLen] = useState(0);
  let arrProductsInCart: any[] = [];
  const storedData = localStorage.getItem("productsCart");

  if (storedData !== null) {
    arrProductsInCart = JSON.parse(storedData);
  }
  const suma = len + arrProductsInCart.length;

  const [lenghtProductInCart, setLenghtProductInCart] = useState(suma);

  const Icons = {
    BackwardIcon: <BackwardIcon />,
    HeartIcon: <HeartIcon />,
    HeartIcon2: <HeartIcon2 />,
    ShoppingcartIcon: <ShoppingcartIcon />,
  };

  const GetProductsInCart = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [setLoading, user, secretKey]);

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user, GetProductsInCart]);

  const addToCart = async (idProduct: any, sizeProduct: any) => {
    toast.success("تم إضافة المنتج بنجاح  ✓");
    try {
      const response = await axios.post(
        `${linkServer.link}cart/addProductToCart`,
        {
          idProduct,
          size: sizeProduct,

          user: user,
        }
      );

      if (response.data === "noExit") {
        if (!arrProductsInCart.includes(idProduct)) {
          arrProductsInCart.push(idProduct);
          updateParent(arrProductsInCart.length + len);
          // toast.success("تم إضافة المنتج بنجاح  ✓");
          // window.location.reload();
          // alert("sd");
          localStorage.setItem(
            "productsCart",
            JSON.stringify(arrProductsInCart)
          );
        }
      }
      if (response.data === "exitSure") {
        const updatedCart = arrProductsInCart.filter(
          (productId) => productId !== idProduct
        );
        updateParent(arrProductsInCart.length - 1 + len);
        localStorage.setItem("productsCart", JSON.stringify(updatedCart));
        // toast.success("تم إضافة المنتج بنجاح  ✓");
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLenghtProductInCart(lenghtProductInCart);
  }, [arrProductsInCart]);

  return (
    <>
      <p className="ml-1" style={{ direction: "rtl" }}>
        <p
          onClick={() => addToCart(id, size)}
          className={`${
            arrProductsInCart.includes(id)
              ? "bg-[var(--mainColorRgba)] text-[var(--mainColor)] p-4 rounded-full"
              : "text-[var(--mainColor)] p-4"
          } hover:cursor-pointer`}
        >
          {Icons.ShoppingcartIcon}
          {/* {lenghtProductInCart} */}
        </p>
      </p>
      {/* <div className="absolute z-50 bg-red-500 top-0 right-0">12</div> */}
    </>
  );
}
