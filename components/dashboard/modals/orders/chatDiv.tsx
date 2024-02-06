//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@nextui-org/react";

//svg
import { ChatbubbleleftrightIcon } from "@/public/svg/chatbubbleleftrightIcon";
import { PaperAirplaneIcon } from "@/public/svg/paperAirplaneIcon";

interface Messages {
  admin: [{ message: string; person: string; date: string; time: string }];
  marketer: [{ message: string; person: string; date: string; time: string }];
  delivery: [{ message: string; person: string; date: string; time: string }];
}

export default function ChatDiv({
  admin,
  idOrder,
  chatMessages,
}: {
  admin: string;
  idOrder: string;
  chatMessages: Messages[];
}) {
  const [showDivCaht, setShowDivCaht] = useState(true);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [messageText, setMessageText] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);

  const Icons = {
    ChatbubbleleftrightIcon: <ChatbubbleleftrightIcon />,
    PaperAirplaneIcon: <PaperAirplaneIcon />,
  };

  const parseDateTime = (dateString: string, timeString: string): number => {
    const [day, month, year] = dateString.split("/");
    const [time, period] = timeString.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    const isPM = period === "PM";
    const hours24 = isPM ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

    const dateTime = new Date(
      +year,
      +month - 1,
      +day,
      hours24,
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
    return dateTime.getTime();
  };

  const today = new Date();
  const todayDateString = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  const allMessages = messages.reduce(
    (
      acc: { message: string; person: string; date: string; time: string }[],
      item: Messages
    ) => {
      acc.push(...item.admin, ...item.marketer, ...item.delivery);
      return acc;
    },
    []
  );

  const sortedMessages = allMessages
    .filter((item) => item.message !== "")
    .sort((a, b) => {
      const dateComparison =
        a.date === todayDateString ? 1 : b.date === todayDateString ? -1 : 0;
      const timeComparison =
        parseDateTime(a.date, a.time) - parseDateTime(b.date, b.time);

      return dateComparison === 0 ? timeComparison : dateComparison;
    });

  const SendMessageApi = async (idOrder: string) => {
    try {
      const response = await axios.post(
        "https://tager-server.vercel.app/orders/chatOrder",
        {
          idOrder: idOrder,
          text: messageText,
          val: "أدمن",
          admin,
        }
      );
      if (response.data === "yes") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            admin: [
              {
                message: messageText,
                person: admin,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
              },
            ],
            marketer: [
              {
                message: "",
                person: "",
                date: "",
                time: "",
              },
            ],
            delivery: [
              {
                message: "",
                person: "",
                date: "",
                time: "",
              },
            ],
          },
        ]);
        setMessageText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (messageText !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [messageText]);

  return (
    <>
      <div>
        <p
          onClick={onOpen}
          className="hover:cursor-pointer hover:opacity-75 bg-danger-200 p-3 mt-1 rounded-full border-1 border-danger-600 text-danger-900 ml-2"
        >
          {Icons.ChatbubbleleftrightIcon}
        </p>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className="bg-red-400 h-0 w-0"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div
                  className={`fixed right-0 bottom-0 lg:w-[30%] md:w-[30%] sm:w-[90%] max-sm:w-[90%] h-auto max-h-[500px] overflow-y-auto z-50 border-1 border-[var(--mainColor)] bg-warning-100 rounded-3xl p-10 pt-2 mr-2 opacity-100`}
                >
                  <div className="w-[100%] flex justify-end ">
                    <span
                      onClick={() => window.location.reload()}
                      className="p-4 hover:cursor-pointer text-danger-600"
                    >
                      ⌧
                    </span>
                  </div>
                  <div className="flex justify-start w-[100%]">
                    <div>
                      {sortedMessages.map((item, index) => (
                        <div key={index}>
                          <p className="bg-warning-200 p-4 rounded-2xl rounded-es-none w-auto mb-2">
                            <p className="mb-2 font-bold">{item.person}</p>
                            <p>{item.message}</p>
                            <p className="opacity-55">{item.time}</p>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className=" flex justify-center items-center">
                    {closeBtn ? (
                      <p className="rotate-180 opacity-75 bg-primary-200 p-3 h-14 w-14 mt-4  rounded-2xl border-1 border-primary-600 text-primary-900 mr-2">
                        {Icons.PaperAirplaneIcon}
                      </p>
                    ) : (
                      <p
                        onClick={() => SendMessageApi(idOrder)}
                        className="rotate-180 hover:cursor-pointer hover:opacity-75 bg-primary-200 p-3 h-14 w-14 mt-4  rounded-2xl border-1 border-primary-600 text-primary-900 mr-2"
                      >
                        {Icons.PaperAirplaneIcon}
                      </p>
                    )}
                    <input
                      type="input"
                      className="input "
                      placeholder="مراسلة ..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          SendMessageApi(idOrder);
                        }
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
