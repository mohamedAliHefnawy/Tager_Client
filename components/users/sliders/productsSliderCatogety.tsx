//react
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import ButtonAddToCart from "@/components/users/addTo/cart";
import ButtonAddToFavourite from "@/components/users/addTo/favourite";
import Link from "next/link";
import AliceCarousel from "react-alice-carousel";

interface Products {
  _id: string;
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

export default function ProductsSliderCatogety({
  catogeryName,
  updateLengthInCart,
}: {
  catogeryName: string;
  updateLengthInCart: any;
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
      <div
        className="flex justify-center rounded-2xl py-4 hover:cursor-pointer lg:w-[50%] md:w-[50%] h-56 sm:w-[100%] max-sm:w-[100%] sm:h-40 max-sm:h-32"
        onClick={() =>
          router.push(`/products/${item.catogry}/${item._id}`)
        }
      >
        <img src={item.image} alt={"error"} className="rounded-md  " />
      </div>
      <div className=" rounded-2xl py-2 mt-2">
        <div
          onClick={() => router.push(`/products/${item.catogry}/${item._id}`)}
          className="flex justify-center items-center hover:cursor-pointer text-sm "
        >
          <p> {item.name} </p>
          <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
        </div>
        <div className="flex justify-center items-center  ">
          <p className="flex ">
            <p className="mr-1">د.ل</p>

            <p className="font-bold">
              {userValidity !== "مندوب تسويق" ? item.price3 : item.price2}
            </p>
          </p>
        </div>
        <div className="flex justify-evenly items-center mt-3 ">
          <ButtonAddToFavourite
            id={item._id}
            index={index}
            updateParent={updateCartLength}
            size={item.size?.[0]?.size}
          />

          <ButtonAddToCart
            id={item._id}
            index={index}
            updateParent={updateCartLength}
            size={item.size?.[0]?.size}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response: { data: { token: string; products: any } };
        response = await axios.get(
          `${linkServer.link}products/getProductsCatogry/${catogeryName}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
          }
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    if (catogeryName) {
      fetchData();
    }
  }, [catogeryName, secretKey]);

  useEffect(() => {
    updateLengthInCart(cartLength);
  }, [cartLength, updateLengthInCart]);

  return (
    <>
      <div className="mt-10 w-[90%] flex justify-end">
        <Link href={`/products/${catogeryName}`}>
          <p className="bg-[var(--mainColorRgba)] hover:cursor-pointer hover:bg-warning-300  rounded-full rounded-es-none p-4">
            {catogeryName}
          </p>
        </Link>
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
