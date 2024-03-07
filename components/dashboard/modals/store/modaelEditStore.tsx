//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
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

export default function ModelEditStore({
  idStoree,
  nameStoree,
  gbsStoree,
  priceDeliveryy,
}: {
  idStoree: string;
  nameStoree: string;
  gbsStoree: string;
  priceDeliveryy: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameStore, setNameStore] = useState(nameStoree);
  const [gbsStore, setGbsStore] = useState(gbsStoree);
  const [closeBtn, setCloseBtn] = useState(true);
  const [priceDelivery, setPriceDelivery] = useState(priceDeliveryy);

  const Body = () => (
    <div className="p-4 flex flex-col items-center">
      <div className="w-[100%] justify-center">
        <input
          type="text"
          id="img"
          className="input"
          placeholder="إسم المخزن"
          value={nameStore}
          onChange={(e) => setNameStore(e.target.value)}
        />
        <input
          type="text"
          id="img"
          className="input"
          placeholder="المكان"
          value={gbsStore}
          onChange={(e) => setGbsStore(e.target.value)}
        />
        <input
          type="number"
          className="input"
          placeholder="سعرالتوصيل للمكان"
          value={priceDelivery}
          onChange={(e) => setPriceDelivery(e.target.value)}
        />
      </div>
    </div>
  );

  const EditStore = async () => {
    try {
      const data = {
        idStoree,
        nameStore,
        gbsStore,
        priceDelivery,
      };
      const response = await axios.post(
        `${linkServer.link}stores/editStore`,
        data
      );
      if (response.data === "yes") {
        toast.info("تم تعديل المخزن بنجاح ✓");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      nameStore !== nameStoree ||
      gbsStore.trim() !== gbsStoree ||
      priceDelivery !== priceDeliveryy
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [
    nameStore,
    gbsStore,
    priceDelivery,
    nameStoree,
    gbsStoree,
    priceDeliveryy,
  ]);

  return (
    <>
      <ToastContainer />
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 mb-1 rounded-full border-1 border-warning-600 text-warning-800"
      >
        {Icons.PencilIcon}
      </p>
      <Modal
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تعديل مخزن ({nameStoree})
              </ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  onClick={EditStore}
                  disabled={closeBtn}
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
