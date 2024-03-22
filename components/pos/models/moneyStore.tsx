//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUnixTime } from "date-fns";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import { TwitterPicker } from "react-color";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tabs,
  Tab,
  Card,
  CardBody,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Avatar,
  Spinner,
  CardFooter,
} from "@nextui-org/react";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents
import { analytics } from "@/fireBase/fireBaseConfig";
import Swal from "sweetalert2";

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function MoneyStoreModel(props: any) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const Table = () => {
    return <>12</>;
  };

  return (
    <>
      <p
        className="p-4 opacity-90 text-black flex flex-col items-center hover:font-bold hover:cursor-pointer transform transition-transform hover:scale-90 hover:animate-pulse text-lg"
        onClick={onOpen}
      >
        <p className="text-lg">{Icons.BanknotesIcon}</p>
        <p className="block hover:font-bold">الخزينة</p>
      </p>
      <Modal
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center w-[100%] ">
                <p className="flex items-center">
                  <p className="mr-2">أموال الكاشير</p>
                  <p>{Icons.BanknotesIcon}</p>
                </p>
              </ModalHeader>
              <ModalBody>{Table()}</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>شـــــكراَ</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
