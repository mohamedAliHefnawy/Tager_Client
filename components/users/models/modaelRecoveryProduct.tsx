//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import linkServer from "@/linkServer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

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

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";
import { ReceiptrefundIcon } from "@/public/svg/receiptrefundIcon";
import Swal from "sweetalert2";

export default function ModaelRecoveryProduct(props: any) {
  const [user, userValidity] = useCheckLogin();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([
    "إختر طريقة الدفع",
  ]);

  const [notes, setNotes] = useState("");

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    ConvertIcon: <ConvertIcon />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
    ReceiptrefundIcon: <ReceiptrefundIcon />,
  };

  const RecoveryOrder = async () => {
    try {
      const data = {
        message: `قد طلب ${user} إسترجاع طلبيه`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        notes: notes,
        // person: user,
      };
      const response = await axios.post(
        `${linkServer.link}notifications/addNotification2`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم  الطلب بنجاح ",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما حاول مرة أخري 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const body = () => {
    return (
      <>
        <div className="p-4">
          <textarea
            className="input min-h-[200px] max-h-[200px] text-right p-6"
            placeholder="أكتب ملاحظاتك"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (notes.trim() !== "") {
      setCloseBtn(false);
    }
  }, [notes]);

  return (
    <>
      <p
        onClick={onOpen}
        className="bg-success-200 border-1 border-success-400 p-4 rounded-full text-success-800 hover:cursor-pointer"
      >
        {Icons.ReceiptrefundIcon}
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
                ! إلغاء طلبية
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={RecoveryOrder}
                >
                  إلغاء الطلبية
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
