"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";

//component
import Link from "next/link";
import Icons from "@/iconsSvg";

//images
import Logo from "@/public/img/hbaieb.png";

//nextUi
import { Avatar } from "@nextui-org/react";

export default function SideBarPos() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("nameKasheer");
    localStorage.removeItem("valKasheer");
    localStorage.removeItem("storeKasheer");
    localStorage.removeItem("moneySafeKasheer");
    router.push("/pos/login");
  };

  const ElementSideBar = (props: any) => {
    return (
      <>
        <Link
          href={props.link}
          className="p-4 opacity-90 text-black flex flex-col items-center hover:font-bold text-lg"
        >
          <p className="text-lg">{props.icon}</p>
          <p className="block hover:font-bold">{props.name}</p>
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="h-[100%] w-36 bg-slate-50 mr-1 rounded-2xl rounded-se-none">
        <Link
          href={"/dashboard/pos"}
          className="p-4 pt-0 opacity-90 text-black text-sm flex flex-col items-center hover:font-bold"
        >
          <Image
            src={Logo}
            alt="error"
            width={90}
            height={90}
            className="rounded-full"
          />
        </Link>

        <ElementSideBar
          name="لوحة التحكم"
          link="/pos"
          icon={Icons.HomeIcon}
        />
        <ElementSideBar
          name="فواتير"
          link="/dashboard/employees"
          icon={Icons.TagIcon}
        />
        <ElementSideBar
          name="الخزينة"
          link="/dashboard/customers"
          icon={Icons.BanknotesIcon}
        />

        <p
          onClick={() => handleLogout()}
          className="p-4 opacity-90 text-black flex flex-col items-center hover:font-bold hover:cursor-pointer text-lg "
        >
          <p className="text-lg">{Icons.LogoutIcon}</p>
          <p className="block hover:font-bold">logout</p>
        </p>
      </div>
    </>
  );
}
