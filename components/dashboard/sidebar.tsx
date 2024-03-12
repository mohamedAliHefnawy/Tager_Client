"use client";

// react
import { useRouter } from "next/navigation";

//component
import Link from "next/link";
import Icons from "@/iconsSvg";

export default function SideBar() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("nameAdmin");
    router.push("/dashboard");
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
          icon={Icons.HomeIcon}
        />
        <ElementSideBar
          name="الموظفين"
          link="/dashboard/employees"
          icon={Icons.UsergroupIcon}
        />
        <ElementSideBar
          name="الزبائن"
          link="/dashboard/customers"
          icon={Icons.UsergroupIcon}
        />
        <ElementSideBar
          name="مندوبي التسويق"
          link="/dashboard/marketingClients"
          icon={Icons.ShoppingcartIcon}
        />
        <ElementSideBar
          name="مندوبي التوصيل"
          link="/dashboard/DeliveryClients"
          icon={Icons.RocketlaunchIcon}
        />
        <ElementSideBar
          name="الطلبيات"
          link="/dashboard/orders"
          icon={Icons.MapIcon}
        />
        <ElementSideBar
          name="الأقسام"
          link="/dashboard/categories"
          icon={Icons.ListbulletIcon}
        />
        <ElementSideBar
          name="المنتجات"
          link="/dashboard/products"
          icon={Icons.ProductsIcon}
        />
        <div className="flex items-center justify-between">
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
          <p className="text-slate-400">إضافات</p>
          <div className="w-[35%] h-[1px] bg-slate-400"></div>
        </div>
        <ElementSideBar
          name="طرق الدفع"
          link="/dashboard/payment"
          icon={Icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الخزينه"
          link="/dashboard/moneySafe"
          icon={Icons.BuildinglibraryIcon}
        />
        <ElementSideBar
          name="طلبات السحب"
          link="/dashboard/withdrawalRequests"
          icon={Icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الموردين"
          link="/dashboard/suppliers"
          icon={Icons.UsergroupIcon}
        />
        <ElementSideBar
          name="المشتريات"
          link="/dashboard/purchases"
          icon={Icons.ShoppingbagIcon}
        />
        <ElementSideBar
          name="نقطة البيع"
          link="/dashboard/employees"
          icon={Icons.StopcircleIcon}
        />
        <ElementSideBar
          name="الكاشير"
          link="/dashboard/kasheer"
          icon={Icons.ComputerDesktopIcon}
        />
        <ElementSideBar
          name="المصاريف"
          link="/dashboard/employees"
          icon={Icons.BanknotesIcon}
        />
        <ElementSideBar
          name="الفواتير"
          link="/dashboard/moneySafe"
          icon={Icons.ClipboarddocumentlistIcon}
        />
        <ElementSideBar
          name="عهدة التوصيل"
          link="/dashboard/deliverySecurity"
          icon={Icons.ArrowtrendingdownIcon}
        />
        <ElementSideBar
          name="المخازن"
          link="/dashboard/store"
          icon={Icons.BuildingstorefrontIcon}
        />

        <div
          onClick={handleLogout}
          className="p-4 pl-5 m-1 cursor-pointer text-slate-700 text-sm flex items-center hover:text-red-500 opacity-[0.7] rounded-2xl hover:font-bold "
        >
          {Icons.ArrowUturnDownIcon}
          <p className="block hover:font-bold ml-3">تسجيل خروج</p>
        </div>
      </div>
    </>
  );
}
