//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getUnixTime } from "date-fns";
import linkServer from "@/linkServer";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents
import { analytics } from "@/fireBase/fireBaseConfig";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";

interface ReturnOrders {
  idProduct: string;
  imageProduct: string;
  nameProduct: string;
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
}

interface InputValues {
  [productId: string]: {
    amount: number;
    size: string;
    store: string;
  };
}

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

export default function ModaelConvertStore({
  productsConvert,
  storeWith,
}: {
  productsConvert: ReturnOrders[];
  storeWith: string;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameStore, setNameStore] = useState("");
  const [gbsStore, setGbsStore] = useState("");
  const [priceDelivery, setPriceDelivery] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [stores, setStores] = useState<Stores[]>([]);

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
  };

  const handleStoreSelection = (productId: any, selectedKeys: any) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [productId]: {
        ...prevValues[productId],
        store: Array.from(selectedKeys),
      },
    }));
  };
  const handleSizeSelection = (productId: any, selectedKeys: any) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [productId]: {
        ...prevValues[productId],
        size: Array.from(selectedKeys),
      },
    }));
  };

  const handleInputChange = (
    productId: string,
    // field: string,
    value: number
    // price: string
  ) => {
    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [productId]: {
          ...prevValues[productId],
          ["amount"]: value,
        },
      };
      return newValues;
    });
  };

  const Body = () => (
    <div className="">
      {productsConvert.map((item, indexItem) => (
        <div
          key={indexItem}
          className="flex justify-end items-center bg-warning-50 border-1 border-slate-200 p-2 rounded-2xl mb-3  "
        >
          <div className="w-[60%] mr-3 flex items-center justify-evenly">
            <p>
              <input
                type="number"
                className="inputTrue"
                placeholder="الكمية"
                value={
                  inputValues[item.idProduct] &&
                  inputValues[item.idProduct].amount
                }
                onChange={(e) =>
                  handleInputChange(
                    item.idProduct,
                    // selectedStore,
                    +e.target.value
                    // movedProduct.price1
                  )
                }
              />
            </p>
            {inputValues[item.idProduct] && inputValues[item.idProduct].size}

            {item.size
              .filter(
                (item2) =>
                  item2.size === inputValues[item.idProduct]?.size &&
                  inputValues[item.idProduct].size
              )
              .map((item4) => {
                const foundStore = item4.store.find(
                  (item5) => item5.nameStore === storeWith
                );
                return foundStore ? foundStore.amount : 0;
              })}

            <p>
              <Dropdown>
                <DropdownTrigger>
                  <Button className="inputTrue">
                    {inputValues[item.idProduct]?.store
                      ? inputValues[item.idProduct]?.store
                      : "المخزن"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  closeOnSelect={false}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={inputValues[item.idProduct]?.store || new Set()}
                  onSelectionChange={(selectedKeys) =>
                    handleStoreSelection(item.idProduct, selectedKeys)
                  }
                >
                  {stores.map((item) => (
                    <DropdownItem key={item.gbs}>{item.gbs}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </p>
            <p>
              <Dropdown>
                <DropdownTrigger>
                  <Button className="inputTrue">
                    {inputValues[item.idProduct]?.size
                      ? inputValues[item.idProduct]?.size
                      : "الحجم"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  closeOnSelect={false}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={inputValues[item.idProduct]?.size || new Set()}
                  onSelectionChange={(selectedKeys) =>
                    handleSizeSelection(item.idProduct, selectedKeys)
                  }
                >
                  {item.size.map((item2) => (
                    <DropdownItem key={item2.size}>{item2.size}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </p>
          </div>
          <p className="text-right text-lg mr-1">
            <span className="flex">
              <span>({/* {item.} */}45)</span>
              <span>{item.nameProduct}</span>
            </span>
            <p className="flex justify-between">
              {/* <span className="text-[12px] text-success-700 flex justify-end">
                <span className="mr-1">د.ل</span>
                <span>{item.}</span>
              </span> */}
              {/* <span className="text-[12px]"> {item.size} </span> */}
            </p>
          </p>
          <p>
            <Avatar src={`${item.imageProduct}`} size="lg" />
          </p>
        </div>
      ))}
    </div>
  );

  const AddStore = async () => {
    try {
      const data = {
        nameStore,
        gbsStore,
        priceDelivery,
      };
      const response = await axios.post(
        `${linkServer.link}stores/addStore`,
        data
      );
      if (response.data === "yes") {
        toast.success("تم إضافة المخزن بنجاح ✓");
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

  const GetStores = async () => {
    try {
      let response: { data: { token: string; stores: any } };
      response = await axios.get(`${linkServer.link}stores/getStores`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setStores(response.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetStores();
  }, []);

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
        <p> تحويل منتجات </p>
      </Button>
      <Modal
        size="4xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p> عملية تحويل منتجات </p>
              </ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={AddStore}
                >
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
