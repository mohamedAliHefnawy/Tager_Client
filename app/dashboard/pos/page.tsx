"use client";

// react
import { useEffect, useState } from "react";
import Image from "next/image";

//components
import NavBarPos from "@/components/pos/navbar";
import SideBarPos from "@/components/pos/sideBar";
import Stores from "@/components/dashboard/tables/store";
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";
import DivCheck from "@/components/dashboard/checkLogin/divCheck";
import Loading from "@/components/loading";

//imges
import error from "@/public/img/notfound.png";

export default function Home() {
  const [nameAdmin] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
            <div className="bg-zinc-200 flex justify-center items-center p-10 lg:h-auto min-h-screen lg:block md:hidden sm:hidden max-sm:hidden">
              <div className="bg-white h-screen rounded-2xl p-6">
                <div className="flex ">
                  <div className="">
                    <SideBarPos />
                  </div>
                  <div className="w-[100%]">
                    <NavBarPos />
                    <div>
                        
                    </div>
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
