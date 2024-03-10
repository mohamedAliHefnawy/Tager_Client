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

export default function NavBarPos() {
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

  return (
    <>
      <div className="flex justify-evenly items-center w-[100%] h-[60px] bg-slate-50 rounded-2xl rounded-ss-none rounded-es-none px-4">
        <div className="flex">
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
          <p className="mr-5 font-bold hover:cursor-pointer">ملابس</p>
        </div>
        <div className="w-[30%]">
          <input className="inputTrue" placeholder="بحث ..." />
        </div>
      </div>
    </>
  );
}
