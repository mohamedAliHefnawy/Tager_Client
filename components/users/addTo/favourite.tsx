// react
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import linkServer from "@/linkServer";

// components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

// svg
import { BackwardIcon } from "@/public/svg/backwardIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import Swal from "sweetalert2";

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

  const [arrProductsInFavourite, setArrProductsInFavourite] = useState(() => {
    const storedData = localStorage.getItem("productsFavourite");
    return storedData !== null ? JSON.parse(storedData) : [];
  });

  const [lenghtProductInFavourite, setLenghtProductInFavourite] = useState(
    arrProductsInFavourite.length
  );

  const Icons = {
    BackwardIcon: <BackwardIcon />,
    HeartIcon: <HeartIcon />,
    HeartIcon2: <HeartIcon2 />,
    ShoppingcartIcon: <ShoppingcartIcon />,
  };

  const GetProductsInFavourite = useCallback(async () => {
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
  }, [user, setLen, secretKey]);

  useEffect(() => {
    if (user) {
      GetProductsInFavourite();
    }
  }, [user, GetProductsInFavourite]);

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
        Swal.fire({
          icon: "success",
          title: "تم إضافه المنتج للمفضلة",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });
        // if (!arrProductsInFavourite.includes(idProduct)) {
        //   const updatedFavourite = [...arrProductsInFavourite, idProduct];
        //   setArrProductsInFavourite(updatedFavourite);
        //   updateParent(updatedFavourite.length);
        //   localStorage.setItem(
        //     "productsFavourite",
        //     JSON.stringify(updatedFavourite)
        //   );
        // }
      }
      if (response.data === "exitSure") {
        Swal.fire({
          icon: "error",
          title: "تم إزالة المنتج من المفضلة",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });
        // const updatedFavourite = arrProductsInFavourite.filter(
        //   (productId: any) => productId !== idProduct
        // );
        // setArrProductsInFavourite(updatedFavourite);
        // updateParent(updatedFavourite.length);
        // localStorage.setItem(
        //   "productsFavourite",
        //   JSON.stringify(updatedFavourite)
        // );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLenghtProductInFavourite(arrProductsInFavourite.length);
  }, [arrProductsInFavourite, setLenghtProductInFavourite]);

  return (
    <>
      <p
        onClick={() => addToFavourite(id, size)}
        className="p-4 hover:cursor-pointer"

        // className={`${
        //   arrProductsInFavourite.includes(id)
        //     ? "text-yellow-500 p-4"
        //     : "text-red-500 p-4"
        // } hover:cursor-pointer`}
      >
        {Icons.HeartIcon}
      </p>
    </>
  );
}
