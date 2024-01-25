"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imgError from "../../../public/img/notfound.png";
import { Button } from "@nextui-org/react";

export default function DivCheck(props: any) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-auto items-center justify-center ">
      <Image alt="error" width={300} height={400} src={imgError} />
      <p>يجب أن تسجل دخول اولاَ </p>
      <Button
        onClick={() => router.push(props.link)}
        color="warning"
        variant="shadow"
        className=" max-lg:w-[30%] lg:w-[30%] md:w-[40%] sm:w-[50%] max-sm:w-[90%] mt-5 text-slate-200"
      >
        تسجيل دخول
      </Button>
    </div>
  );
}
