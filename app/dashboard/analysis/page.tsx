"use client";

//components
import NavBar from "@/components/dashboard/navbar";
import SideBar from "@/components/dashboard/sidebar";
import Chart1 from "@/components/dashboard/chart1";
import Chart2 from "@/components/dashboard/chart2";
import Chart1_1 from "@/components/dashboard/chart1-1";
import Chart3 from "@/components/dashboard/chart3";
import Chart4 from "@/components/dashboard/chart4";
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import Loading from "../loading";

// react
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

//imges
import error from "../../../public/img/notfound.png";

interface Employee {
  _id: string;
  name: string;
  phone1: string;
  phone2: string;
  password: string;
  image: string;
  validity: string;
}

export default function Home() {
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (nameAdmin) {
      const timeoutId = setTimeout(() => {
        setUsername(nameAdmin);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [nameAdmin]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : nameAdmin ? (
          <>
            <div className="bg-zinc-200 lg:h-auto min-h-screen flex justify-between max-2xl:flex max-xl:flex lg:flex md:hidden sm:hidden max-sm:hidden">
              <div className="w-[20%] bg-white">
                <SideBar />
              </div>
              <div className="w-[100%] flex-col flex items-center ">
                <NavBar />
                <div className="w-[80%] h-5"></div>
                <div className="flex w-[90%]">
                  <div className="w-[50%] h-96 mr-4 bg-slate-100 rounded-r-3xl  rounded-2xl p-6">
                    <Chart1_1 />
                  </div>
                  <div className="w-[50%] h-96 bg-slate-100 rounded-r-3xl  rounded-2xl p-6">
                    <Chart2 />
                  </div>
                </div>
                <div className="flex w-[90%] mt-4">
                  <div className="w-[50%] h-[430px] mr-4 bg-slate-100 rounded-r-3xl  rounded-2xl p-6">
                    <Chart3 />
                  </div>
                  <div className="w-[50%] h-[430px] mr-4 bg-slate-100 rounded-r-3xl  rounded-2xl p-6">
                    {/* <Chart4 /> */} <Chart1 />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex max-2xl:hidden max-xl:hidden lg:hidden md:flex sm:flex max-sm:flex h-screen flex-col items-center justify-center">
              <Image src={error} alt={"error"} width={200} height={300} />
              <p> عفوا مقاس الشاشه الخاص بك غير مدعوم ☹ </p>
            </div>
          </>
        ) : (
          <DivCheck link="/dashboard" />
        )}
      </div>
    </>
  );
}
