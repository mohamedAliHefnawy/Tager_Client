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
  chatMessages: [
    {
      admin: [{ message: string; date: string; time: string }];
      marketer: [{ message: string; date: string; time: string }];
      delivery: [{ message: string; date: string; time: string }];
    }
  ];
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

  const Icons = {
    ChatbubbleleftrightIcon: <ChatbubbleleftrightIcon />,
    PaperAirplaneIcon: <PaperAirplaneIcon />,
  };

  const SendMessageApi = async (idOrder: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/orders/chatOrder",
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
            chatMessages: [
              {
                admin: [{ message: messageText, date: "", time: "" }],
                marketer: [],
                delivery: [],
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
                  className={`fixed right-0 bottom-0 lg:w-[30%] md:w-[30%] sm:w-[90%] max-sm:w-[90%] h-auto max-h-96 overflow-y-auto z-50 border-1 border-[var(--mainColor)] bg-warning-100 rounded-3xl p-10 pt-2 mr-2 opacity-100`}
                >
                  <div className="w-[100%] flex justify-end ">
                    <span
                      onClick={onClose}
                      className="p-4 hover:cursor-pointer text-danger-600"
                    >
                      ⌧
                    </span>
                  </div>
                  <div className=" flex justify-start w-[100%]">
                    <div>
                      {chatMessages &&
                        chatMessages.map((item, index) => (
                          <div key={index}>
                            {item.admin.map((item2, indexItem2) => (
                              <p
                                key={indexItem2}
                                className="bg-warning-200 p-4 rounded-2xl w-auto mb-2"
                              >
                                <p key={indexItem2}>{item2.message}</p>{" "}
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className=" flex justify-end w-[100%]">
                    <div>
                      {messages &&
                        messages.map((item, index) => (
                          <div key={index}>
                            {item.chatMessages.map((item2, indexItem2) => (
                              <p key={indexItem2}>
                                {item2.marketer.map((msg, indexMsg) => (
                                  <p key={indexMsg}>{msg.message}</p>
                                ))}
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className=" flex justify-end w-[100%]">
                    <div>
                      {messages &&
                        messages.map((item, index) => (
                          <div key={index}>
                            {item.chatMessages.map((item2, indexItem2) => (
                              <p key={indexItem2}>
                                {item2.delivery.map((msg, indexMsg) => (
                                  <p key={indexMsg}>{msg.message}</p>
                                ))}
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className=" flex justify-center items-center">
                    <p
                      onClick={() => SendMessageApi(idOrder)}
                      className="rotate-180 hover:cursor-pointer hover:opacity-75 bg-primary-200 p-3 h-14 w-14 mt-4  rounded-2xl border-1 border-primary-600 text-primary-900 mr-2"
                    >
                      {Icons.PaperAirplaneIcon}
                    </p>
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
