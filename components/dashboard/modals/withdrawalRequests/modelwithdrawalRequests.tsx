//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
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

//components
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";

export default function ModelwithdrawalRequests({
  idWithdrawalRequests,
  PaymentWithdrawalRequests,
  moneyWithdrawalRequests,
}: {
  idWithdrawalRequests: string;
  PaymentWithdrawalRequests: string;
  moneyWithdrawalRequests: number;
}) {
  const [nameAdmin] = useCheckLogin();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = React.useState("1");

  const Confirm = async () => {
    try {
      const data = {
        idWithdrawalRequests,
        PaymentWithdrawalRequests,
        moneyWithdrawalRequests,
        nameAdmin,
      };
      const response = await axios.post(
        `${linkServer.link}withdrawalRequests/confirmPayment`,
        data
      );
      if (response.data === "yes") {
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما. حاول مرة أخرى 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-success-200 p-3 mt-1 rounded-full border-1 border-success-600 text-success-900"
      >
        {Icons.BanknotesIcon}
      </p>
      <Modal
        size="md"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">تأكيد !</ModalHeader>
              <ModalBody>
                <p className="flex">
                  <span className="mr-1 font-bold">
                    {PaymentWithdrawalRequests}
                  </span>
                  <span>
                    سيتم خصم مبلغ قيمته
                    <span className="mx-1 font-bold">
                      <span>{moneyWithdrawalRequests}</span>
                      <span>د.ل</span>
                    </span>
                    من محفظة
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color="warning"
                  // disabled={closeBtn}
                  onClick={Confirm}
                  onPress={onClose}
                >
                  تأكيد
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
