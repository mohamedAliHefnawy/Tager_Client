//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

//compentes
import useCheckLogin from "@/components/dashboard/checkLogin/checkLogin";

interface MoneyTransfer {
  _id: string;
  idOrder: string;
  idMoney: string;
  marketer: string;
  money: number;
  moneyMarketer: number;
  moneyAdmin: number;
}

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function ModaelMoneyTransfers({
  money,
  idMoneyTransfer,
}: {
  money: MoneyTransfer[];
  idMoneyTransfer: string;
}) {
  const [nameAdmin] = useCheckLogin();
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [salaryFrom, setSalaryFrom] = useState("");
  const [moneyTransfer, setMoneyTransfer] = useState<MoneyTransfer[]>([]);
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState(
    new Set(["الخزينة"])
  );
  const selectedValuePayment = React.useMemo(
    () => Array.from(selectedPayment).join(", ").replaceAll("_", " "),
    [selectedPayment]
  );
  const handleSelectionChange = (selectedItems: string[]) => {
    setSelectedPayment(new Set(selectedItems));
  };

  const body = () => {
    return (
      <>
        <div className="p-16">
          <div className="flex border-1 border-slate-500 py-4">
            <p className="w-[15%] text-center">المبلغ</p>
            <p className="w-[25%] text-center">مندوب التسويق</p>
            <p className="w-[25%] text-center">ربح مندوب التسويق</p>
            <p className="w-[25%] text-center">ربح الأدمن</p>
            <p className="w-[25%] text-center">-</p>
          </div>

          {moneyTransfer &&
            moneyTransfer.length > 0 &&
            moneyTransfer.map((item, index) => (
              <p key={index}>
                <div className="flex items-center border-1 mt-2 border-slate-500 py-4">
                  <p className="flex justify-center mt-4 w-[15%] ">
                    <p className="mr-1">د.ل</p>
                    <p>{item.money}</p>
                  </p>
                  <p className="mt-4 w-[25%] text-center">{item.marketer}</p>
                  <p className="flex justify-center w-[25%] mt-4">
                    <p className="mr-1">د.ل</p>
                    <p>{item.moneyMarketer}</p>
                  </p>
                  <p className="flex justify-center w-[25%] mt-4">
                    <p className="mr-1">د.ل</p>
                    <p>{item.moneyAdmin}</p>
                  </p>
                  <p
                    className="flex justify-center w-[25%] mt-4 text-success-400 hover:cursor-pointer"
                    onClick={() =>
                      AcceptMoney(
                        item.idOrder,
                        item.marketer,
                        item.money,
                        item.moneyMarketer,
                        item.moneyAdmin,
                        item._id
                      )
                    }
                  >
                    {Icons.TagIcon}
                  </p>
                </div>
              </p>
            ))}
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="default"
                variant="bordered"
                className="w-[100%] my-4 rounded-full"
              >
                {selectedValuePayment}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
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
      </>
    );
  };

  useEffect(() => {
    if (money) {
      setMoneyTransfer(money);
    }
  }, [money]);

  const AcceptMoney = async (
    idOrder: string,
    marketer: string,
    money: number,
    moneyMarketer: number,
    moneyAdmin: number,
    _id: string
  ) => {
    if (selectedValuePayment !== "الخزينة") {
      const filter = moneyTransfer.filter((item) => item._id !== _id);
      setMoneyTransfer(filter);
      try {
        const response = await axios.post(
          `${linkServer.link}moneyTransfers/acceptMoney`,
          {
            idOrder: idOrder,
            idMoney: _id,
            idMoneyTransfer,
            marketer: marketer,
            nameAdmin,
            money: money,
            gainMarketer: moneyMarketer,
            gainAdmin: moneyAdmin,
            selectedValuePayment,
          }
        );

        if (response.data === "yes") {
          Swal.fire({
            icon: "success",
            title: "تمت العملية بنجاح",
            text: "✓",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "حسنًا",
          });
        }
        if (response.data === "no") {
          alert("توجد مشكلة حاول مره أخري ☹");
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "اختر الخزينة من فضلك",
        text: "⤫",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "حسنًا",
      });
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

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={Icons.BanknotesIcon}
        color="warning"
        className="w-[100%] rounded-full text-warning-800"
      >
        إستلام
      </Button>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className="max-h-screen overflow-y-auto scrollDashbordPos"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center">
                <p>إستلام أموال</p>
                <p className="ml-1">{Icons.BanknotesIcon}</p>
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button color="warning" onPress={onClose}>
                  شكرا
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
