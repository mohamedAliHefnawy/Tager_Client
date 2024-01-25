//react
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function ElementsSlider() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const router = useRouter();
  const [categories, setCategories] = useState<Categories[]>([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow: 8,
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

  const GetCategories = async () => {
    try {
      let response: { data: { token: string; categories: any } };
      response = await axios.get(
        "https://tager-server.vercel.app/categories/getCategories",
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setCategories(response.data.categories);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetCategories();
  }, []);

  return (
    <>
      <div className=" w-[90%] pb-6 ">
        <div className="mt-10 mb-4 w-[100%] flex justify-end">
          <Link href={`/products`}>
            <p className="bg-[var(--mainColorRgba)] hover:cursor-pointer  rounded-full rounded-es-none p-4">
              كل الأقسام
            </p>
          </Link>
        </div>
        <Slider {...settings}>
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-auto hover:cursor-pointer"
              onClick={() => router.push(`/products/${item.name}`)}
            >
              <div className="rounded-full  w-28 h-28 border-1 border-[var(--mainColor)] bg-[var(--mainColorRgba)]">
                <Image
                  src={item.image}
                  alt={"error"}
                  width={100}
                  height={90}
                  className="w-[100%] h-[100%] rounded-full"
                />
              </div>
              <div className=" text-center mt-2 w-28">
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
