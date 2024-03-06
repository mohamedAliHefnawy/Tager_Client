import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import { BackwardIcon } from "@/public/svg/backwardIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import Swal from "sweetalert2";

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
  const [lenghtProductInCart, setLenghtProductInCart] = useState(0);

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
      setLenghtProductInCart(response.data.combinedProducts.length);
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
        Swal.fire({
          icon: "success",
          title: "تم إضافه المنتج للسله",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });

        updateParent(lenghtProductInCart);
        setLenghtProductInCart(lenghtProductInCart + 1);
      }
      if (response.data === "exitSure") {
        Swal.fire({
          icon: "error",
          title: "تم إزالة المنتج من السلة",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });

        // setLenghtProductInCart(lenghtProductInCart - 1);
        updateParent(lenghtProductInCart);
        setLenghtProductInCart(lenghtProductInCart - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="ml-1" style={{ direction: "rtl" }}>
        {/* {divToast()} */}
        <p
          onClick={() => addToCart(id, size)}
          className="p-4 hover:cursor-pointer"
          //   className={
          //     `${
          //     arrProductsInCart.includes(id)
          //       ? "bg-[var(--mainColorRgba)] text-[var(--mainColor)] p-4 rounded-full"
          //       : "text-[var(--mainColor)] p-4"
          //   } hover:cursor-pointer`
          // }
        >
          {lenghtProductInCart}
          {Icons.ShoppingcartIcon}
        </p>
      </p>
    </>
  );
}
