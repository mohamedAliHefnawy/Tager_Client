//react
import React, { useState, useEffect } from "react";
import axios from "axios";
import linkServer from "@/linkServer";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

//svg
import { BackwardIcon } from "@/public/svg/backwardIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";

export default function ButtonAddToFavourite({
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

  let arrProductsInFavourite: any[] = [];
  const storedData = localStorage.getItem("productsFavourite");

  if (storedData !== null) {
    arrProductsInFavourite = JSON.parse(storedData);
  }

  const [lenghtProductInFavourite, setLenghtProductInFavourite] = useState(
    arrProductsInFavourite.length
  );

  const Icons = {
    BackwardIcon: <BackwardIcon />,
    HeartIcon: <HeartIcon />,
    HeartIcon2: <HeartIcon2 />,
    ShoppingcartIcon: <ShoppingcartIcon />,
  };

  const addToFavourite = async (idProduct: any, sizeProduct: any) => {
    try {
      const response = await axios.post(
        `${linkServer.link}favourite/addProductToFavourite`,
        {
          idProduct,
          size: sizeProduct,
          user: user,
        }
      );

      if (response.data === "noExit") {
        if (!arrProductsInFavourite.includes(idProduct)) {
          arrProductsInFavourite.push(idProduct);
          setLenghtProductInFavourite(arrProductsInFavourite.length);
          localStorage.setItem(
            "productsFavourite",
            JSON.stringify(arrProductsInFavourite)
          );
        }
      }
      if (response.data === "exitSure") {
        const updatedFavourite = arrProductsInFavourite.filter(
          (productId: any) => productId !== idProduct
        );
        setLenghtProductInFavourite(arrProductsInFavourite.length - 1);
        localStorage.setItem(
          "productsFavourite",
          JSON.stringify(updatedFavourite)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p
        onClick={() => addToFavourite(id, size)}
        className={`${
          arrProductsInFavourite.includes(id)
            ? "text-yellow-500 p-4"
            : "text-red-500 p-4"
        } hover:cursor-pointer`}
      >
        {Icons.HeartIcon}
      </p>
    </>
  );
}
