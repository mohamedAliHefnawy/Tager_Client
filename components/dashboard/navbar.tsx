"use client";

// react
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import linkServer from "@/linkServer";

// nextUi
import {
  Tooltip,
  User,
  Spinner,
  Badge,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";

// svgIcons
import { BellalertIcon } from "@/public/svg/bellalertIcon";
import { BackwardIcon } from "@/public/svg/backwardIcon";

interface Notifications {
  _id: string;
  message: string;
  date: string;
  time: string;
  marketer: string;
  notes: string;
  person: string;
}

export default function NavBar() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [loading, setLoading] = useState(true);
  const usernamee = localStorage.getItem("nameAdmin");
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const icons = {
    BellalertIcon: <BellalertIcon />,
    BackwardIcon: <BackwardIcon />,
  };

  const AcceptMoney = async (
    person: string,
    message: string,
    idMessage: string,
    marketer: string
  ) => {
    const regex = /\d+/;
    let number = 0;
    const match = message.match(regex);

    const [firstNumber, secondNumber] = message
      .match(/--(\d+)--(\d+)--/)
      ?.slice(1)
      .map((number) => parseInt(number, 10)) || [0, 0];

    const marketerMoney = parseInt(String(firstNumber).substring(1));
    const deliveryMoney = parseInt(String(secondNumber).substring(1));

    if (match) {
      number = parseInt(match[0], 10);
    } else {
      console.log("لم يتم العثور على أي رقم في النص");
    }
    try {
      const data = {
        id: idMessage,
        nameDelivery: person,
        nameAdmin: usernamee,
        marketer: marketer,
        money: number,
        marketerMoney,
        deliveryMoney,
      };
      const response = await axios.post(
        `${linkServer.link}users/acceptMoney `,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم الإستلام بنجاح",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });

        const filter = notifications.filter((item) => item._id !== idMessage);
        setNotifications(filter);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const DeclineMoney = async (
    person: string,
    message: string,
    idMessage: string,
    marketer: string
  ) => {
    const regex = /\d+/;
    let number = 0;
    const match = message.match(regex);

    const [firstNumber, secondNumber] = message
      .match(/--(\d+)--(\d+)--/)
      ?.slice(1)
      .map((number) => parseInt(number, 10)) || [0, 0];

    const marketerMoney = parseInt(String(firstNumber).substring(1));
    const deliveryMoney = parseInt(String(secondNumber).substring(1));

    if (match) {
      number = parseInt(match[0], 10);
    } else {
      console.log("لم يتم العثور على أي رقم في النص");
    }
    try {
      const data = {
        id: idMessage,
        nameDelivery: person,
        nameAdmin: usernamee,
        marketer: marketer,
        money: number,
        marketerMoney,
        deliveryMoney,
      };
      const response = await axios.post(
        `${linkServer.link}users/declineMoney`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم الرفض بنجاح",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        const filter = notifications.filter((item) => item._id !== idMessage);
        setNotifications(filter);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetNotifications = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; notifications: any } };
      response = await axios.get(
        `${linkServer.link}notifications/getNotifications`,
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
                  <Badge
                    color="success"
                    content={notifications.length}
                    shape="circle"
                  >
                    <span className="text-black">{icons.BellalertIcon}</span>
                  </Badge>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[100%] flex flex-col justify-start items-end max-h-[500px] min-h-96 overflow-y-auto  P-4 py-6">
              {notifications.length > 0 ? (
                notifications
                  .slice()
                  .reverse()
                  .map((item, indexItem) => (
                    <div key={indexItem} className="flex items-center">
                      <p
                        style={{ direction: "rtl" }}
                        className="text-lg pr-10 flex items-center mb-6"
                      >
                        <span className="ml-2 text-warning-500">✦</span>

                        {item.message.startsWith("تم تحويل مبلغ قدرة") ? (
                          <>
                            <span className="">
                              {item.message.replace(/--\d+--\d+--/, "")}
                            </span>

                            <p
                              onClick={() =>
                                DeclineMoney(
                                  item.person,
                                  item.message,
                                  item._id,
                                  item.marketer
                                )
                              }
                              className="text-danger-600 text-lg mr-6 mb-2 hover:cursor-pointer hover:bg-danger-50 rounded-full p-4"
                            >
                              رفض
                            </p>
                            <p
                              onClick={() =>
                                AcceptMoney(
                                  item.person,
                                  item.message,
                                  item._id,
                                  item.marketer
                                )
                              }
                              className="text-success-600 text-lg mr-6 mb-2 hover:cursor-pointer hover:bg-success-50 rounded-full p-4"
                            >
                              إستلام
                            </p>
                          </>
                        ) : (
                          <p className=""> {item.message}</p>
                        )}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="w-[100%] h-96 text-lg flex justify-center items-center">
                  لا يوجد أي إشعارات
                </p>
              )}
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
