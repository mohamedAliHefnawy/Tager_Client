//react
import React, { useEffect, useState } from "react";

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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

//svgIcon
import { DeleteIcon } from "../../../../public/svg/deleteIcon";
import { BanknotesIcon } from "../../../../public/svg/banknotesIcon";

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function ModelPaymentpurchases({
  idPurchase,
  namePatient,
  supplierr,
  moneySafee,
  totalPrice,
  indept,
  discount,
}: {
  idPurchase: string;
  namePatient: string;
  supplierr: string;
  moneySafee: string;
  totalPrice: number;
  indept: number;
  discount: string;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [sumMoney, setSumMoney] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const usernamee = localStorage.getItem("username");
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = React.useState(
    new Set([moneySafee])
  );

  const icons = {
    DeleteIcon: <DeleteIcon />,
    BanknotesIcon: <BanknotesIcon />,
  };

  const selectedValuePayment = React.useMemo(
    () => Array.from(selectedPayment).join(", ").replaceAll("_", " "),
    [selectedPayment]
  );

  const handleSelectionChange = (selectedItems: string[]) => {
    setSelectedPayment(new Set(selectedItems));
  };

  const PaymentMoney = async () => {
    setCloseBtn(true);
    try {
      const data = {
        id: idPurchase,
        employee: usernamee,
        Price: sumMoney,
        payment: selectedValuePayment,
        supplier: supplierr,
      };
      const response = await axios.post(
        "https://tager-server.vercel.app/purchases/paymentPurchases",
        data
      );
      if (response.data === "yes") {
        alert("تم الدفع بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما حاول مرة أخري 😓");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetMoneySafe = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get("https://tager-server.vercel.app/payment/getpayment", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMoneySafe(response.data.payment);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tempDiscountedAmount = +totalPrice - (+discount / 100) * +totalPrice;
    setDiscountedTotal(tempDiscountedAmount);
  }, [discount, totalPrice]);

  useEffect(() => {
    if (sumMoney.trim() !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [sumMoney]);

  useEffect(() => {
    GetMoneySafe();
  }, []);

  return (
    <>
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 rounded-full border-1 border-warning-600 text-warning-900"
      >
        {icons.BanknotesIcon}
      </p>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">! دفع</ModalHeader>

              <ModalBody>
                <div className="flex justify-center">
                  <p className="flex mx-1 font-bold">
                    <p className="mr-1">د.ل</p>
                    <p>{totalPrice}</p>
                  </p>
                  <p> من إجمالي </p>
                  <p className="flex mx-1 font-bold">
                    <p className="mr-1">د.ل</p>
                    <p>{indept + +sumMoney}</p>
                  </p>
                  <p> تم دفع </p>
                </div>
                <div className="mt-4">
                  <Input
                    type="number"
                    color="default"
                    className={`w-[100%] rounded-xl border-1 border-warning-300 font-bold text-center ${
                      discountedTotal === 0 ? "opacity-80 " : "opacity-100"
                    }`}
                    startContent="د.ل"
                    placeholder="ما المبلغ الذي تريد دفعة الان ؟"
                    value={sumMoney}
                    disabled={discountedTotal === 0 ? true : false}
                    onChange={(e) => {
                      if (
                        +e.target.value > 0 &&
                        +e.target.value <= discountedTotal
                      ) {
                        setSumMoney(e.target.value);
                      }
                    }}
                  />

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        color="warning"
                        variant="bordered"
                        className="w-[100%] my-4"
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
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={() => PaymentMoney()}
                >
                  دفع
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
