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

interface Notifications {
  _id: string;
  message: string;
  date: string;
  time: string;
  notes: string;
  person: string;
}

export default function NavBar() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [loading, setLoading] = useState(true);
  const usernamee = localStorage.getItem("nameAdmin");
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const router = useRouter();

  const icons = {
    BellalertIcon: <BellalertIcon />,
    BackwardIcon: <BackwardIcon />,
  };

  const handleLogout = () => {
    localStorage.removeItem(" ");
    router.push("/dashboard");
  };

  const AcceptMoney = async (person: string) => {
    try {
      const data = {
        person: person,
      };
      const response = await axios.post(
        "http://localhost:5000/notifications/addNotification",
        data
      );
      // if (response.data === "yes") {
      //   Swal.fire({
      //     icon: "success",
      //     title: "تم التحويل بنجاح",
      //     text: "⤫",
      //     confirmButtonColor: "#3085d6",
      //     confirmButtonText: "حسنًا",
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const GetNotifications = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; notifications: any } };
      response = await axios.get(
        "http://localhost:5000/notifications/getNotifications",
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetNotifications();
  }, []);

  const notif = () => {
    return (
      <>
        <div className=" text-white text-sm flex items-center justify-between pr-5 hover:font-bold hover:cursor-pointer hover:transform hover:scale-110 transition-transform duration-300">
          <Popover className="w-[1000px]" placement="right" backdrop="blur">
            <PopoverTrigger>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Badge color="success" content={5} shape="circle">
                    <span className="text-black">{icons.BellalertIcon}</span>
                  </Badge>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[100%] flex flex-col justify-start items-end h-72 P-4 py-6">
              {notifications.map((item, indexItem) => (
                <div key={indexItem} className="flex items-center">
                  <p className="text-danger-600 text-lg mr-6 mb-2 hover:cursor-pointer hover:bg-danger-50 rounded-full p-4">
                    رفض
                  </p>
                  <p
                    onClick={() => AcceptMoney(item.person)}
                    className="text-success-600 text-lg mr-6 mb-2 hover:cursor-pointer hover:bg-success-50 rounded-full p-4"
                  >
                    إستلام
                  </p>
                  <p
                    style={{ direction: "rtl" }}
                    className="text-lg pr-10 flex items-center mb-2"
                  >
                    <span className="ml-2 text-warning-500">✦</span>
                    <span>{item.message}</span>
                  </p>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  };

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
                // description={employee?.validity}
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
