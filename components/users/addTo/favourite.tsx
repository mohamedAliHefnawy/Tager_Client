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

interface Products {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  price2: number;
  price3: number;
  size: [{ size: string }];
}

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
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [products, setProducts] = useState<Products[]>([]);
  const [len, setLen] = useState(0);

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

  const GetProductsInCart = async () => {
    try {
      let response: {
        data: { token: string; combinedProducts: any };
      };
      response = await axios.get(
        `${linkServer.link}favourite/getProductsInFavourite/${user}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setLen(response.data.combinedProducts.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user]);

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

  useEffect(() => {
    setLenghtProductInFavourite(lenghtProductInFavourite);
  }, [arrProductsInFavourite]);

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
