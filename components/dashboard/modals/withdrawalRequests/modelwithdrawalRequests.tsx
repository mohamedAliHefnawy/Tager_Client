//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import linkServer from "@/linkServer";

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

//components
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";


//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { PencilIcon } from "../../../../public/svg/pencilIcon";
import { BanknotesIcon } from "../../../../public/svg/banknotesIcon";

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
  const [closeBtn, setCloseBtn] = useState(true);
  const [selected, setSelected] = React.useState("1");
  const [situation, setSituation] = React.useState<
    { situation: string; date: string; time: string }[]
  >([]);

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    PencilIcon: <PencilIcon />,
    BanknotesIcon: <BanknotesIcon />,
  };

  const Confirm = async () => {
    try {
      const data = {
        idWithdrawalRequests,
        PaymentWithdrawalRequests,
        moneyWithdrawalRequests,
        nameAdmin
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
        {icons.BanknotesIcon}
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
