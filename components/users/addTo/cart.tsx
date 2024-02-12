//react
import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [user] = useCheckLogin();

  let arrProductsInCart: any[] = [];
  const storedData = localStorage.getItem("productsCart");

  if (storedData !== null) {
    arrProductsInCart = JSON.parse(storedData);
  }

  const [lenghtProductInCart, setLenghtProductInCart] = useState(
    arrProductsInCart.length
  );

  const Icons = {
    BackwardIcon: <BackwardIcon />,
    HeartIcon: <HeartIcon />,
    HeartIcon2: <HeartIcon2 />,
    ShoppingcartIcon: <ShoppingcartIcon />,
  };

  const addToCart = async (idProduct: any, sizeProduct: any) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/cart/addProductToCart`,
        {
          idProduct,
          size: sizeProduct,

          user: user,
        }
      );

      if (response.data === "noExit") {
        if (!arrProductsInCart.includes(idProduct)) {
          arrProductsInCart.push(idProduct);
          setLenghtProductInCart(arrProductsInCart.length);
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
        setLenghtProductInCart(arrProductsInCart.length - 1);
        localStorage.setItem("productsCart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   updateParent(arrProductsInCart.length);
  // }, [arrProductsInCart]);

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
        </p>
      </p>
    </>
  );
}
