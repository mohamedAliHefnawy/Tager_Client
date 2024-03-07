//react
import React from "react";
import QRCode from "qrcode.react";
import Icons from "@/iconsSvg";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function QrCode({ idOrder }: { idOrder: String }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-success-200 p-3 mt-1 rounded-full border-1 border-success-600 text-success-900"
      >
        {Icons.QrCodeIcon}
      </p>
      <Modal
        size="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">َ</ModalHeader>
              <ModalBody className="flex justify-center items-center">
                <QRCode value={`${idOrder}`} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
