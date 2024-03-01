"use client";

// react
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// svgIcons
import { ArrowUturnDownIcon } from "../../public/svg/arrowUturnDownIcon";
import { HomeIcon } from "../../public/svg/homeIcon";
import { CheckBadgeIcon } from "../../public/svg/checkBadgeIcon";
import { UsergroupIcon } from "../../public/svg/usergroupIcon";
import { EyedropperIcon } from "../../public/svg/eyedropperIcon";
import { BellalertIcon } from "../../public/svg/bellalertIcon";
import { BuildinglibraryIcon } from "../../public/svg/buildinglibraryIcon";
import { BuildingstorefrontIcon } from "../../public/svg/buildingstorefrontIcon";
import { CreditcardIcon } from "../../public/svg/creditcardIcon";
import { ServerstackIcon } from "../../public/svg/serverstackIcon";
import { FacefrownIcon } from "../../public/svg/facefrownIcon";
import { BanknotesIcon } from "../../public/svg/banknotesIcon";
import { ShoppingcartIcon } from "../../public/svg/shoppingcartIcon";
import { ShoppingbagIcon } from "../../public/svg/shoppingbagIcon";
import { RocketlaunchIcon } from "../../public/svg/rocketlaunchIcon";
import { MapIcon } from "../../public/svg/mapIcon";
import { ProductsIcon } from "../../public/svg/productsIcon";
import { ListbulletIcon } from "../../public/svg/listbulletIcon";
import { StopcircleIcon } from "../../public/svg/stopcircleIcon";
import { ClipboarddocumentlistIcon } from "../../public/svg/clipboarddocumentlistIcon";
import { ArrowtrendingdownIcon } from "../../public/svg/arrowtrendingdownIcon";

//component
import Link from "next/link";

export default function SideBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("nameAdmin");
    router.push("/dashboard");
  };

  const icons = {
    HomeIcon: <HomeIcon />,
    CheckBadgeIcon: <CheckBadgeIcon />,
    UsergroupIcon: <UsergroupIcon />,
    EyedropperIcon: <EyedropperIcon />,
    BellalertIcon: <BellalertIcon />,
    BuildinglibraryIcon: <BuildinglibraryIcon />,
    BuildingstorefrontIcon: <BuildingstorefrontIcon />,
    CreditcardIcon: <CreditcardIcon />,
    ServerstackIcon: <ServerstackIcon />,
    ListbulletIcon: <ListbulletIcon />,
    FacefrownIcon: <FacefrownIcon />,
    StopcircleIcon: <StopcircleIcon />,
    BanknotesIcon: <BanknotesIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
    ClipboarddocumentlistIcon: <ClipboarddocumentlistIcon />,
    MapIcon: <MapIcon />,
    ShoppingcartIcon: <ShoppingcartIcon />,
    RocketlaunchIcon: <RocketlaunchIcon />,
    ArrowtrendingdownIcon: <ArrowtrendingdownIcon />,
    ProductsIcon: <ProductsIcon />,
  };

  const ElementSideBar = (props: any) => {
    return (
      <>
        <Link
          href={props.link}
          className="p-4 pl-5 opacity-90 text-black text-sm flex items-center hover:font-bold hover:transform hover:scale-110 transition-transform duration-300"
        >
          {props.icon}
          <p className="block hover:font-bold ml-3">{props.name}</p>
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="max-h-[900px] overflow-y-auto scrollDashbordSideBar">
        <div className="p-6 flex justify-center ">
          <p className="text-black font-bold text-xl">EL_HABIEB</p>
        </div>
        <div className="w-[100%] h-10"></div>
        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <p className="text-slate-400">الرئيسيه</p>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>

        <ElementSideBar
          name="لوحة التحكم"
          link="/dashboard/analysis"
          icon={icons.HomeIcon}
        />
        <ElementSideBar
          name="الموظفين"
          link="/dashboard/employees"
          icon={icons.UsergroupIcon}
        />
        <ElementSideBar
          name="الزبائن"
          link="/dashboard/customers"
          icon={icons.UsergroupIcon}
        />
        <ElementSideBar
          name="مندوبي التسويق"
          link="/dashboard/marketingClients"
          icon={icons.ShoppingcartIcon}
        />
        <ElementSideBar
          name="مندوبي التوصيل"
          link="/dashboard/DeliveryClients"
          icon={icons.RocketlaunchIcon}
        />
        <ElementSideBar
          name="الطلبيات"
          link="/dashboard/orders"
          icon={icons.MapIcon}
        />
        <ElementSideBar
          name="الأقسام"
          link="/dashboard/categories"
          icon={icons.ListbulletIcon}
        />
        <ElementSideBar
          name="المنتجات"
          link="/dashboard/products"
          icon={icons.ProductsIcon}
        />
        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <p className="text-slate-400">إضافات</p>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>
        <ElementSideBar
          name="طرق الدفع"
          link="/dashboard/payment"
          icon={icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الخزينه"
          link="/dashboard/moneySafe"
          icon={icons.BuildinglibraryIcon}
        />
        <ElementSideBar
          name="طلبات السحب"
          link="/dashboard/withdrawalRequests"
          icon={icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الموردين"
          link="/dashboard/suppliers"
          icon={icons.UsergroupIcon}
        />
        <ElementSideBar
          name="المشتريات"
          link="/dashboard/purchases"
          icon={icons.ShoppingbagIcon}
        />
        <ElementSideBar
          name="نقطة البيع"
          link="/dashboard/employees"
          icon={icons.StopcircleIcon}
        />
        <ElementSideBar
          name="المصاريف"
          link="/dashboard/employees"
          icon={icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الفواتير"
          link="/dashboard/moneySafe"
          icon={icons.ClipboarddocumentlistIcon}
        />
        <ElementSideBar
          name="عهدة التوصيل"
          link="/dashboard/deliverySecurity"
          icon={icons.ArrowtrendingdownIcon}
        />
        {/* <ElementSideBar
          name="المرتجع"
          link="/dashboard/returns"
          icon={icons.ArrowtrendingdownIcon}
        /> */}
        <ElementSideBar
          name="المخازن"
          link="/dashboard/store"
          icon={icons.BuildingstorefrontIcon}
        />

        <div
          onClick={handleLogout}
          className="p-4 pl-5 m-1 cursor-pointer text-slate-700 text-sm flex items-center hover:text-red-500 opacity-[0.7] rounded-2xl hover:font-bold "
        >
          <ArrowUturnDownIcon />
          <p className="block hover:font-bold ml-3">تسجيل خروج</p>
        </div>
      </div>
    </>
  );
}
