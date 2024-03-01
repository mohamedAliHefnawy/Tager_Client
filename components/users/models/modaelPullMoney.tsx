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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import Swal from "sweetalert2";

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function ModaelPullMoney({
  totalMoney,
}: {
  totalMoney: number;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const [user, userValidity] = useCheckLogin();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [money, setMoney] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedPayment, setSelectedPayment] = React.useState(
    new Set(["إختر طريقة الدفع"])
  );

  const handleSelectionChange = (selectedItems: string[]) => {
    setSelectedPayment(new Set(selectedItems));
  };

  const selectedValuePayment = React.useMemo(
    () => Array.from(selectedPayment).join(", ").replaceAll("_", " "),
    [selectedPayment]
  );

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    ConvertIcon: <ConvertIcon />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
  };

  const body = () => {
    return (
      <>
        <div className="p-4">
          <input
            type="number"
            className="input"
            placeholder="المبلغ المراد سحبة"
            value={money}
            onChange={(e) => {
              const value = +e.target.value;
              if (value <= +totalMoney) {
                setMoney(value.toString());
              }
            }}
          />
          <div className="my-3 flex items-center">
            <input
              type="string"
              className="input mr-2"
              placeholder="رقم الهاتف"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Dropdown className=" w-[200%] relative right-24">
              <DropdownTrigger>
                <Button
                  startContent={Icons.ArrowUturnDownIcon}
                  variant="bordered"
                  color="warning"
                  className="capitalize w-[100%] h-16 mt-5"
                >
                  {selectedValuePayment}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedPayment}
                onSelectionChange={(keys: string[] | any) =>
                  handleSelectionChange(keys)
                }
              >
                {moneySafe.map((item) => (
                  <DropdownItem key={item.name}>{item.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </>
    );
  };

  const RequestWithdraw = async () => {
    setCloseBtn(true);
    try {
      const data = { money, marketer: user, phoneNumber, selectedValuePayment };
      const response = await axios.post(
        `${linkServer.link}withdrawalRequests/addwithdrawalRequest`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم الطلب بنجاح",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
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

  const GetMoneySafe = async () => {
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get(`${linkServer.link}payment/getpayment`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMoneySafe(response.data.payment);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetMoneySafe();
  }, []);

  useEffect(() => {
    if (
      money.trim() !== "" &&
      selectedValuePayment !== "إختر طريقة الدفع" &&
      phoneNumber.trim() !== ""
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [money, selectedValuePayment, phoneNumber]);
  return (
    <>
      <Button
        onPress={onOpen}
        // startContent={icons.ShoppingbagIcon}
        color="warning"
        className="w-[100%]"
      >
        سحب الارباح
      </Button>

      <Modal
        size="4xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                سحب أموال
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={RequestWithdraw}
                >
                  تأكيدالسحب
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
