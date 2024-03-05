import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import { BackwardIcon } from "@/public/svg/backwardIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";

export default function ButtonAddToCart({
  id,
  size,
  updateParent,
}: {
  id: any;
  size: any;
  updateParent: any;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user] = useCheckLogin();
  const [loading, setLoading] = useState(true);
  const [len, setLen] = useState(0);
  const [productsCart, setProductsCart] = useState(() => {
    const storedData = localStorage.getItem("productsCart");
    return storedData !== null ? JSON.parse(storedData) : [];
  });

  const suma = len + productsCart.length;

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
        // alert(productsCart);
        // toast.success("تم إضافة المنتج بنجاح  ✓");
        // if (!productsCart.includes(idProduct)) {
        //   setProductsCart([...productsCart, idProduct]);
        //   updateParent(productsCart.length + len + 1);
        // }
        setLen(len + 1)
      } else if (response.data === "exitSure") {
        // alert(productsCart);
        setLen(len + 1)
        // const updatedCart = productsCart.filter(
        //   (productId: string) => productId !== idProduct
        // );
        // setProductsCart(updatedCart);
        // updateParent(updatedCart.length + len);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLenghtProductInCart(len);
    // localStorage.setItem("productsCart", JSON.stringify(productsCart));
  }, [productsCart]);

  return (
    <>
      <p className="ml-1" style={{ direction: "rtl" }}>
        <p
          onClick={() => addToCart(id, size)}
          className={`${
            productsCart.includes(id)
              ? "bg-[var(--mainColorRgba)] text-[var(--mainColor)] p-4 rounded-full"
              : "text-[var(--mainColor)] p-4"
          } hover:cursor-pointer`}
        >
          {Icons.ShoppingcartIcon}
        </p>
      </p>
    </>
  );
}
