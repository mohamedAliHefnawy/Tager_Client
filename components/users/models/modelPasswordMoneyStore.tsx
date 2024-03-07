//react
import React from "react";

//nextui
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";

export default function ModelPasswordMoneyStore() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p onClick={onOpen} className="mr-1 text-slate-700">
        المحفظة
      </p>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className="bg-red-400 h-0 w-0"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>12</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
