//react
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import AliceCarousel from "react-alice-carousel";

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

  const responsive = {
    0: {
      items: 2,
    },
    576: {
      items: 2,
    },
    768: {
      items: 5,
    },
    992: {
      items: 5,
    },
    1200: {
      items: 6,
    },
  };

  const items = categories.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-center w-auto hover:cursor-pointer"
      onClick={() => router.push(`/products/${item.name}`)}
    >
      <div>
        <div className="rounded-full w-28 h-28 border-1 border-[var(--mainColor)] bg-[var(--mainColorRgba)]">
          <Image
            src={item.image}
            alt={"error"}
            width={100}
            height={90}
            className="w-[100%] h-[100%] rounded-full"
          />
        </div>
        <div className="text-center mt-2 w-20 ml-3">
          <p>{item.name}</p>
        </div>
      </div>
    </div>
  ));

  const GetCategories = async () => {
    try {
      let response: { data: { token: string; categories: any } };
      response = await axios.get(`${linkServer.link}categories/getCategories`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetCategories();
  }, []);

  return (
    <>
      <div className="w-[90%] pb-6">
        <div className="mt-10 mb-4 w-[100%] flex justify-end">
          <Link href={`/products`}>
            <p className="bg-[var(--mainColorRgba)] hover:cursor-pointer hover:bg-warning-300 rounded-full rounded-es-none p-4">
              كل الأقسام
            </p>
          </Link>
        </div>

        <AliceCarousel
          responsive={responsive}
          mouseTracking
          autoPlay
          autoPlayInterval={3000}
          items={items}
          disableButtonsControls 
        />
      </div>
    </>
  );
}
