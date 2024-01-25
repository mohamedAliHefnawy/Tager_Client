//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

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

export default function ModaelEditOrder({
  idCatog,
  nameCatog,
  priceCatog,
}: {
  idCatog: string;
  nameCatog: string;
  priceCatog: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameCategory, setNameCategory] = useState(nameCatog);
  const [priceCategory, setPriceCategory] = useState(priceCatog);
  const [closeBtn, setCloseBtn] = useState(true);
  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  // const EditStore = async () => {
  //   try {
  //     const data = { id: idCatog, name: nameCategory, price: priceCategory };
  //     const response = await axios.post(
  //       "https://server-clinic.vercel.app/store/editstore",
  //       data
  //     );
  //     if (response.data === "yes") {
  //       alert("تم تعديل الصنف بنجاح ✓");
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

  const icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    PencilIcon: <PencilIcon />,
  };

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="1">
              <Card>
                <CardBody>1</CardBody>
              </Card>
            </Tab>
            <Tab key="2" title="2">
              <Card>
                <CardBody>2</CardBody>
              </Card>
            </Tab>
            <Tab key="3" title="3">
              <Card>
                <CardBody>3</CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (nameCategory.trim() !== nameCatog) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [nameCategory]);

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
                  onPress={onClose}
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  // onClick={EditStore}
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
