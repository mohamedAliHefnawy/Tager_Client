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

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { PencilIcon } from "../../../../public/svg/pencilIcon";

export default function ModelwithdrawalRequests({
  idOrder,
  delivery,
}: {
  idOrder: string;
  delivery: string;
}) {
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
  };

  const ChangeSituation = (newSituation: string) => {
    const newSituationItem = {
      situation: newSituation,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    const isAlreadySelected = situation.some(
      (item) => item.situation === newSituation
    );
    if (isAlreadySelected) {
      setSituation((prevSituation) =>
        prevSituation.filter((item) => item.situation !== newSituation)
      );
    } else {
      setSituation((prevSituation) => [...prevSituation, newSituationItem]);
    }
  };

  const tabs = () => {
    return <>12</>;
  };

  // const EditOrder = async () => {
  //   setCloseBtn(true);
  //   try {
  //     const data = { idOrder: idOrder, situationOrder: situation };
  //     const response = await axios.post(
  //       `${linkServer.link}orders/editOrderSituation`,
  //       data
  //     );
  //     if (response.data === "yes") {
  //       // alert("تم تعديل الصنف بنجاح ✓");
  //       // sendDataToParent({
  //       //   orderId: order._id,
  //       //   data: situation[situation.length - 1].situation,
  //       // });
  //       window.location.reload();
  //     }
  //     if (response.data === "no") {
  //       alert("توجد مشكلة ما. حاول مرة أخرى 😓");
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   if (situationSteps) {
  //     setSituation(situationSteps);
  //   }
  // }, [situationSteps]);

  // useEffect(() => {
  //   if (
  //     situation !== situationSteps &&
  //     situationSteps[situationSteps.length - 1].situation !== "تم إستلام الكاش"
  //   ) {
  //     setCloseBtn(false);
  //   } else {
  //     setCloseBtn(true);
  //   }
  // }, [situation]);

  return (
    <>
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 mt-1 rounded-full border-1 border-warning-600 text-warning-900"
      >
        {icons.PencilIcon}
      </p>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تعديل الطلبية
              </ModalHeader>
              <ModalBody>{tabs()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color="warning"
                  // disabled={closeBtn}
                  // onClick={EditOrder}/
                  onPress={onClose}
                >
                  تعديل
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
