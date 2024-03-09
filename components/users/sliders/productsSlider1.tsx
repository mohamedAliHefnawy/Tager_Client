//react
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import Swal from "sweetalert2";
import AliceCarousel from "react-alice-carousel";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import ButtonAddToCart from "@/components/users/addTo/cart";
import ButtonAddToFavourite from "@/components/users/addTo/favourite";

interface Products {
  idProduct: string;
  image: string;
  price1: number;
  price2: number;
  price3: number;
  name: string;
  catogry: string;
  products: string;
  active: boolean;
  size: [{ size: string }];
}
export default function ProductsSlider1({
  updateLengthInCart,
  updateLengthInFavoutire,
}: {
  updateLengthInCart: any;
  updateLengthInFavoutire: any;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const router = useRouter();
  const [userName, userValidity] = useCheckLogin();
  const [products, setProducts] = useState<Products[]>([]);
  const [cartLength, setCartLength] = useState(0);

  const updateCartLength = (length: any) => {
    setCartLength(length);
  };

  const responsive = {
    0: {
      items: 2,
    },
    576: {
      items: 2,
    },
    768: {
      items: 4,
    },
    992: {
      items: 5,
    },
    1200: {
      items: 6,
    },
  };

  const items = products.map((item, index) => (
    <div
      key={index}
      className="p-8 py-3 mr-2 h-auto w-auto flex flex-col items-center "
    >
      {item.idProduct !== "" ? (
        <div
          className="flex justify-center rounded-2xl py-4 hover:cursor-pointer lg:w-[50%] md:w-[50%] h-56 sm:w-[100%] max-sm:w-[100%] sm:h-40 max-sm:h-32"
          onClick={() =>
            router.push(`/products/${item.catogry}/${item.idProduct}`)
          }
        >
          <img src={item.image} alt={"error"} className="rounded-md  " />
        </div>
      ) : (
        <div
          className="flex justify-center rounded-2xl py-4 hover:cursor-pointer lg:w-[50%] md:w-[50%] h-56 sm:w-[100%] max-sm:w-[100%] sm:h-40 max-sm:h-32"
          onClick={() => Sw()}
        >
          <img src={item.image} alt={"error"} className="rounded-md  " />
        </div>
      )}

      <div className=" rounded-2xl py-2 mt-2">
        {item.idProduct !== "" ? (
          <div
            onClick={() =>
              router.push(`/products/${item.catogry}/${item.idProduct}`)
            }
            className="flex justify-center items-center hover:cursor-pointer text-sm "
          >
            <p> {item.name} </p>
            <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
          </div>
        ) : (
          <div
            onClick={() => Sw()}
            className="flex justify-center items-center hover:cursor-pointer text-sm "
          >
            <p> {item.name} </p>
            <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
          </div>
        )}

        <div className="flex justify-center items-center  ">
          <p className="flex ">
            <p className="mr-1">د.ل</p>

            <p className="font-bold">
              {userValidity !== "مندوب تسويق" ? item.price3 : item.price2}
            </p>
          </p>
        </div>
        <div className="flex justify-evenly items-center mt-3 ">
          {item.idProduct === "" ? (
            <></>
          ) : (
            <>
              <ButtonAddToFavourite
                id={item.idProduct}
                index={index}
                updateParent={updateCartLength}
                size={item.size}
              />

              <ButtonAddToCart
                id={item.idProduct}
                index={index}
                updateParent={updateCartLength}
                size={item.size}
              />
            </>
          )}
        </div>
      </div>
    </div>
  ));

  const Sw = () => {
    Swal.fire({
      icon: "success",
      title: "يجب الدخول لصفحة المنتج من المنتج الرئيسي",
      text: "✓",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "حسنًا",
    });
  };

  const GetProducts = async () => {
    try {
      let response: { data: { token: string; top5Products: any } };
      response = await axios.get(
        `${linkServer.link}analysis/getBestProductsSelling`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setProducts(response.data.top5Products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    updateLengthInCart(cartLength);
  }, [cartLength, updateLengthInCart]);

  return (
    <>
      <div className="mt-10 w-[90%] flex justify-end">
        <p className="bg-[var(--mainColorRgba)] rounded-full rounded-es-none p-4">
          أكثر المنتجات طلباََ
        </p>
      </div>

      <div className=" w-[90%] pb-6 ">
        <div className="w-[100%]">
          <AliceCarousel
            responsive={responsive}
            mouseTracking
            autoPlay
            autoPlayInterval={3000}
            items={items}
            disableButtonsControls
          />
        </div>
      </div>
    </>
  );
}
