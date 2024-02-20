//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";


//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";
import { ReceiptrefundIcon } from "@/public/svg/receiptrefundIcon";
import { CircleStackIcon } from "@/public/svg/circleStackIcon";

interface Products {
  idProduct: string;
  _id: string;
  name: string;
  price2: string;
  price3: string;
  catogry: string;
  nameProduct: string;
  imageProduct: string;
  products: [{ image: string }];
  amount: number;
  price: number;
  gainMarketer: number;
  size: string;
  image: string;
}

export default function ModaelShowProductsOrder({
  produts,
}: {
  produts: Products[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([
    "إختر طريقة الدفع",
  ]);

  const handleSelectionChangeProducts = (selectedItems: any) => {
    if (Array.isArray(selectedItems)) {
      setSelectedProducts(selectedItems);
    } else {
      const keysArray = Array.from(selectedItems);
      const stringKeysArray = keysArray.map(String);
      setSelectedProducts(stringKeysArray);
    }
  };

  const selectedValueProducts = React.useMemo(
    () => Array.from(selectedProducts).join(", ").replaceAll("_", " "),
    [selectedProducts]
  );

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    ConvertIcon: <ConvertIcon />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
    ReceiptrefundIcon: <ReceiptrefundIcon />,
    CircleStackIcon: <CircleStackIcon />,
  };

  const body = () => {
    return (
      <>
        <div className="p-4">
          {produts.map((item, itemIndex) => (
            <div key={itemIndex} className="flex justify-end items-center mb-4">
              <div className="flex flex-col items-end mr-3">
                <div>
                  <p className="font-bold">{item.nameProduct}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="flex mr-5 text-warning-500">
                    <span>د.ل</span>
                    <span>{item.price}</span>
                  </p>

                  <p>{item.size}</p>
                </div>
              </div>

              <Avatar size="lg" src={`${item.imageProduct}`} />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <p
        onClick={onOpen}
        className="bg-danger-200 border-1 border-danger-400 p-4 mt-1 rounded-full text-danger-800 hover:cursor-pointer"
      >
        {Icons.CircleStackIcon}
      </p>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ! منتجات الطلبية
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>شكرا</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
