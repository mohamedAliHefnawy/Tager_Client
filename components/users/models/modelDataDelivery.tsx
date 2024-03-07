//react
import React from "react";
import Icons from "@/iconsSvg";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export default function ModelDataDelivery({
  nameDelivery,
  phoneDelivery,
}: {
  nameDelivery: string;
  phoneDelivery: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        onClick={onOpen}
        className="mr-1 hover:cursor-pointer text-warning-500 p-4"
      >
        {Icons.EyeIcon}
      </p>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className="h-96 w-96"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>مندوب التوصيل</ModalHeader>
              <ModalBody className="p-10 flex flex-col items-end text-lg">
                <p className="flex">
                  <span className="mr-4">{nameDelivery}</span>
                  <span style={{ direction: "rtl" }}>الإسم |</span>
                </p>
                <p className="flex mt-4">
                  <span className="mr-4">{phoneDelivery}</span>
                  <span style={{ direction: "rtl" }}>رقم الهاتف |</span>
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
