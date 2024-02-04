"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imgError from "../../../public/img/notfound.png";
import { Button } from "@nextui-org/react";

export default function DivCheck(props : any) {
  const router = useRouter();

  return (
    <div
      className="flex flex-col h-screen"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Image alt="error" width={300} height={400} src={imgError} />
      <p>يجب أن تسجل دخول اولاَ </p>
      <Button
        onClick={() => router.push(props.link)}
        color="primary"
        variant="shadow"
        className="w-[30%] mt-5"
      >
        تسجيل دخول
      </Button>
    </div>
  );
}