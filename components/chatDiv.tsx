//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//nextui
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Badge,
} from "@nextui-org/react";

interface Messages {
  message: string;
  person: string;
  valid: string;
  seeMessage: boolean;
  date: string;
  time: string;
}

export default function ChatDiv({
  user,
  userValidity,
  idOrder,
  chatMessages,
}: {
  user: string;
  userValidity: string;
  idOrder: string;
  chatMessages: Messages[];
}) {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [messages2, setMessages2] = useState({
    message: "",
    person: "",
    valid: "",
    date: "",
    time: "",
  });

  const [messageText, setMessageText] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);


  const ShowedOrlready = async () => {
    onOpen();
    try {
      const response = await axios.post(
        `${linkServer.link}orders/showedMessages`,
        {
          idOrder: idOrder,
          user,
          val: userValidity,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const SendMessageApi = async (idOrder: string) => {
    try {
      const response = await axios.post(`${linkServer.link}orders/chatOrder`, {
        idOrder: idOrder,
        text: messageText,
        val: userValidity,
        user,
      });
      const { answer, message } = response.data;
      setMessages2(message);

      if (answer === "yes") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: messageText,
            person: user,
            valid: userValidity,
            seeMessage: false,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
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

  const filteredMessages = messages.filter((message) => {
    return (
      (message.person !== user && message.valid !== userValidity) ||
      message.seeMessage === false
    );
  });

  return (
    <>
      <Badge
        content={filteredMessages.length}
        color="warning"
        placement="top-right"
        className="hover:cursor-pointer hover:opacity-75 bg-primary-200 p-3 mt-1 rounded-full border-1 border-primary-600 text-primary-900"
      >
        <p
          onClick={ShowedOrlready}
          className="ml-2 hover:cursor-pointer hover:opacity-75 bg-primary-200 p-3 mt-1 rounded-full border-1 border-primary-600 text-primary-900"
        >
          {Icons.ChatbubbleleftrightIcon}
        </p>
      </Badge>

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
                  className={`fixed z-50 right-0 bottom-0 lg:w-[30%] md:w-[30%] sm:w-[90%] max-sm:w-[90%] h-auto max-h-[500px] overflow-y-auto border-1 border-[var(--mainColor)] bg-warning-100 rounded-3xl p-10 pt-2 mr-2 mb-20 opacity-100`}
                >
                  <div className="w-[100%] flex justify-end ">
                    <span
                      onClick={onClose}
                      className="p-4 hover:cursor-pointer text-danger-600"
                    >
                      ⌧
                    </span>
                  </div>
                  <div className="flex justify-start w-[100%]">
                    <div>
                      {messages.map((item, index) => (
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
