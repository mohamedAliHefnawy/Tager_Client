//react
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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

  let arrProductsInCart: any[] = [];
  const storedData1 = localStorage.getItem("productsCart");

  if (storedData1 !== null) {
    arrProductsInCart = JSON.parse(storedData1);
  }

  let arrProductsInFavourite: any[] = [];
  const storedData2 = localStorage.getItem("productsFavourite");

  if (storedData2 !== null) {
    arrProductsInFavourite = JSON.parse(storedData2);
  }
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5,
        },
      },
    ],
  };

  const Toast = () => {
    toast.success("يجب الدخول لصفحة المنتج من المنتج الرئيسي");
  };

  return (
    <>
      <div className="mt-10 w-[90%] flex justify-end">
        <p className="bg-[var(--mainColorRgba)] rounded-full rounded-es-none p-4">
          أكثر المنتجات طلباََ
        </p>
      </div>

      <div className=" w-[90%] pb-6 ">
        <div className="w-[100%]">
          <Slider {...settings}>
            {products.map((item, index) => (
              <div key={index} className="p-8 py-3 mr-2 h-auto ">
                <div className="flex justify-center rounded-2xl py-4">
                  <Image
                    className="w-[90%] h-36"
                    src={item.image}
                    alt={"error"}
                    width={100}
                    height={100}
                  />
                </div>
                <div className=" rounded-2xl py-2 mt-2">
                  {item.idProduct !== "" ? (
                    <div
                      onClick={() =>
                        router.push(
                          `/products/${item.catogry}/${item.idProduct}`
                        )
                      }
                      className="flex justify-center items-center hover:cursor-pointer "
                    >
                      <p> {item.name} </p>
                      <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        Swal.fire({
                          icon: "success",
                          title: "يجب الدخول لصفحة المنتج من المنتج الرئيسي",
                          text: "✓",
                          confirmButtonColor: "#3085d6",
                          confirmButtonText: "حسنًا",
                        })
                      }
                      className="flex justify-center items-center hover:cursor-pointer "
                    >
                      <p> {item.name} </p>
                      <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
                    </div>
                  )}

                  <div className="flex justify-center items-center  ">
                    <p className="flex ">
                      <p className="mr-1">د.ل</p>

                      <p className="font-bold">
                        {userValidity !== "مندوب تسويق"
                          ? item.price3
                          : item.price2}
                      </p>
                    </p>
                  </div>
                  <div className="flex justify-evenly items-center mt-3 ">
                    <ButtonAddToFavourite
                      id={item.idProduct}
                      index={index}
                      updateParent={updateCartLength}
                      size={item.size?.[0]?.size}
                    />

                    <ButtonAddToCart
                      id={item.idProduct}
                      index={index}
                      updateParent={updateCartLength}
                      size={item.size?.[0]?.size}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
