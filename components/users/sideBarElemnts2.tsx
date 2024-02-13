//react
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";

//svg
import { BackwardIcon } from "@/public/svg/backwardIcon";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function SideBarElemnts(props: any) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [categories, setCategories] = useState<Categories[]>([]);

  const Icons = {
    BackwardIcon: <BackwardIcon />,
  };

  const GetCategories = async () => {
    try {
      let response: { data: { token: string; categories: any } };
      response = await axios.get(`${linkServer.link}categories/getCategories`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
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
      <div className="h-screen overflow-y-auto w-80  bg-[var(--mainColorRgbaa)] fixed z-30 py-10 px-5 flex flex-col ">
        <p className=" text-center">كل الأقسام</p>
        <div className="w-[100%] h-[1px] bg-[var(--mainColor)] my-3">
          {categories.map((item, index) => (
            <div key={index} className="flex items-center my-4">
              <Link
                href={`${item.name}`}
                className="w-[100%] flex flex-col items-center"
              >
                <p className="w-[100%] flex justify-end items-center text-xl">
                  <p className="mr-1">{item.name}</p>
                  <div className="rounded-full  w-10 h-10">
                    <Image
                      src={item.image}
                      alt={"error"}
                      width={100}
                      height={100}
                      className="w-[100%] h-[100%] rounded-full"
                    />
                  </div>
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
