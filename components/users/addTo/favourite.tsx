// react
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import Swal from "sweetalert2";

// components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

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
  const [len, setLen] = useState(0);

  const [lenghtProductInFavourite, setLenghtProductInFavourite] = useState(0);

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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLenghtProductInFavourite(lenghtProductInFavourite);
  }, [lenghtProductInFavourite, setLenghtProductInFavourite]);

  return (
    <>
      <p
        onClick={() => addToFavourite(id, size)}
        className="p-4 hover:cursor-pointer"
      >
        {Icons.HeartIcon}
      </p>
    </>
  );
}
