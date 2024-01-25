"use client";

// react
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// nextUi
import {
  Tooltip,
  User,
  Spinner,
  Badge,
  Button,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";

// svgIcons
import { BellalertIcon } from "../../public/svg/bellalertIcon";
import { BackwardIcon } from "../../public/svg/backwardIcon";

interface Employee {
  _id: string;
  name: string;
  phone1: string;
  phone2: string;
  password: string;
  image: string;
  validity: string;
}

interface Store {
  _id: string;
  name: string;
  price: string;
  amount: string;
  details: [
    {
      _id: string;
      price: Number;
      amount: Number;
      date: String;
      expirydate: String;
    }
  ];
}

export default function NavBar() {
  const [loading, setLoading] = useState(true);
  const usernamee = localStorage.getItem("nameAdmin");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [store, setStore] = useState<Store[]>([]);
  const router = useRouter();

  const icons = {
    BellalertIcon: <BellalertIcon />,
    BackwardIcon: <BackwardIcon />,
  };

  const handleLogout = () => {
    localStorage.removeItem(" ");
    router.push("/dashboard");
  };

  const GetEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-clinic.vercel.app/employees/getemployee/${usernamee}`
      );
      setEmployee(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetEmployees();
  }, []);

  const tooltip = () => {
    return (
      <>
        {/* <div>
          <Model />
        </div> */}

        <Button
          onClick={() => router.push(`/dashboard/account/${usernamee}`)}
          variant="faded"
          color="primary"
        >
          حسابي
        </Button>
      </>
    );
  };

  const notif = () => {
    return (
      <>
        <div className=" text-white text-sm flex items-center justify-between pr-5 hover:font-bold hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-300">
          <Popover className="w-[500px]" placement="right" backdrop="blur">
            <PopoverTrigger>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Badge color="success" content={5} shape="circle">
                    <span className="text-black">{icons.BellalertIcon}</span>
                  </Badge>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] flex flex-col justify-start h-72 P-4 py-6">
              سيستم الحبايب
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  };

  const GetStore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://server-clinic.vercel.app/store/getstore"
      );
      setStore(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetStore();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center w-[90%] h-[60px] bg-slate-100 rounded-2xl">
        <div className="flex justify-start items-center w-[35%] h-[60px] pl-6 ">
          <p className="text-black opacity-90 font-bold text-xl mr-5">
            Dashboard
          </p>
        </div>

        <div className="mr-7 flex items-center">
          {notif()}
          <Tooltip
            showArrow
            placement="bottom"
            content={12}
            classNames={{
              base: "py-2 px-4 shadow-xl text-black bg-gradient-to-br from-white to-neutral-400 rounded-lg",
              arrow: "bg-neutral-400 dark:bg-white",
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : (
              <User
                className="hover:cursor-pointer"
                name={
                  <p className="text-black opacity-90  font-medium">
                    {usernamee}
                  </p>
                }
                description={employee?.validity}
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                }}
              />
            )}
          </Tooltip>
        </div>
      </div>
    </>
  );
}
