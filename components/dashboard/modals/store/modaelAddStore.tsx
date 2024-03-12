//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

interface Stores {
  _id: string;
  name: string;
  details: [
    {
      gbs: string;
      price: number;
    }
  ];
}

interface ModelAddCategoryProps {
  nameStoree: string;
  setNameStoree: React.Dispatch<React.SetStateAction<string>>;
  gbsStoree: string;
  setGbsStoree: React.Dispatch<React.SetStateAction<string>>;
  onAddStoree: (newStore: Stores) => void;
}

export default function ModelAddCategory({
  nameStoree,
  setNameStoree,
  gbsStoree,
  setGbsStoree,
  onAddStoree,
}: ModelAddCategoryProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameStore, setNameStore] = useState("");
  const [gbsStore, setGbsStore] = useState("");
  const [priceDelivery, setPriceDelivery] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [additionalInputs, setAdditionalInputs] = useState<any[]>([]);

  const handleButtonClick = () => {
    setAdditionalInputs([
      ...additionalInputs,
      { gbsStore: "", priceDelivery: "" },
    ]);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedInputs = [...additionalInputs];
    updatedInputs[index][field] = value;
    setAdditionalInputs(updatedInputs);
  };

  const handleDeleteClick = (index: number) => {
    const updatedInputs = [...additionalInputs];
    updatedInputs.splice(index, 1);
    setAdditionalInputs(updatedInputs);
  };

  const Body = () => (
    <div className="p-4 flex flex-col items-center">
      <div className="w-[100%]">
        <input
          type="text"
          className="input"
          placeholder="إسم المخزن"
          value={nameStore}
          onChange={(e) => setNameStore(e.target.value)}
        />
        <Button
          variant="bordered"
          color="warning"
          className="mt-4 w-[100%]"
          onClick={handleButtonClick}
        >
          إضافة مكان
        </Button>
        {additionalInputs.map((input, index) => (
          <div key={index} className="flex">
            <input
              type="text"
              className="input mr-2"
              placeholder="المكان"
              value={input.gbsStore}
              onChange={(e) =>
                handleInputChange(index, "gbsStore", e.target.value)
              }
            />
            <input
              type="number"
              className="input"
              placeholder="سعر التوصيل للمكان"
              value={input.priceDelivery}
              onChange={(e) =>
                handleInputChange(index, "priceDelivery", e.target.value)
              }
            />
            <button
              className="mt-3 text-danger-500"
              onClick={() => handleDeleteClick(index)}
            >
              {Icons.DeleteIcon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const AddStore = async () => {
    try {
      const data = {
        nameStore,
        additionalInputs,
      };
      const response = await axios.post(
        `${linkServer.link}stores/addStore`,
        data
      );
      if (response.data === "yes") {
        // onAddStoree({
        //   _id: new Date().toISOString(),
        //   name: nameStore,
        //   gbs: gbsStore,
        //   priceDelivery: priceDelivery,
        // });
        // setNameStore("");
        // setGbsStore("");
        toast.success("تم إضافة المخزن بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "nameUse") {
        Swal.fire({
          icon: "warning",
          title: "هذا المخزن مستخدم من قبل ",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (nameStore !== "" && gbsStore.trim() !== "" && priceDelivery !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [nameStore, gbsStore, priceDelivery]);

  return (
    <>
      <ToastContainer />
      <Button
        onPress={onOpen}
        color="warning"
        className="mt-5 h-14 opacity-90 rounded-full px-4"
        startContent={Icons.PlusIcon}
      >
        <p> إضافة مخزن </p>
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p> إضافة مخزن </p>
              </ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button color="warning" onClick={AddStore}>
                  إضافة
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
