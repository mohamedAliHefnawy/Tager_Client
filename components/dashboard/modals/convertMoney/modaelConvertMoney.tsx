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
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";


//images
import exChange from "../../../../public/img/exchange.png";

//compentes
import useCheckLogin from "../../../../components/dashboard/checkLogin/checkLogin";

interface MoneyItem {
  value: string;
  notes: string;
  date: string;
  time: string;
  person: string;
}
interface Payment {
  _id: string;
  name: string;
  active: boolean;
  money: MoneyItem[];
}

export default function ModaelConvertMoney(props: any) {
  const [nameAdmin] = useCheckLogin();
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [sum, setSum] = useState(0);
  const [methodPayment, setMethodPayment] = useState<Payment[]>([]);
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedKeysFrom, setSelectedKeysFrom] = React.useState<string[]>([
    "إختر المحفظه ال تريد التحويل منها",
  ]);
  const [selectedKeysTo, setSelectedKeysTo] = React.useState<string[]>([
    "إختر المحفظه ال تريد التحويل إليها",
  ]);

  

  const handleSelectionChangeFrom = (selectedItems: string[]) => {
    setSelectedKeysFrom(selectedItems);
  };

  const handleSelectionChangeTo = (selectedItems: string[]) => {
    setSelectedKeysTo(selectedItems);
  };

  const selectedValueFrom = React.useMemo(
    () =>
      selectedKeysFrom
        ? Array.from(selectedKeysFrom).join(", ").replaceAll("_", " ")
        : "",
    [selectedKeysFrom]
  );

  const selectedValueTo = React.useMemo(
    () => Array.from(selectedKeysTo).join(", ").replaceAll("_", " "),
    [selectedKeysTo]
  );

  const handleInputSum = (e: { target: { value: string | number } }) => {
    const newValue = +e.target.value;

    if (newValue >= 0 && newValue <= sum) {
      setSalaryFrom(newValue.toString());
    }
  };

  const body = () => {
    return (
      <>
        <div className="flex justify-between ">
          <div className="border-1 w-[40%] border-warning-700 border-dashed rounded-3xl p-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  startContent={Icons.ArrowUturnDownIcon}
                  variant="bordered"
                  color="warning"
                  className="capitalize w-[100%] "
                >
                  {selectedValueFrom}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeysFrom}
                onSelectionChange={(keys: string[] | any) =>
                  handleSelectionChangeFrom(keys)
                }
              >
                {methodPayment
                  .filter((payment) => payment.active === true)
                  .map((payment) => (
                    <DropdownItem key={payment.name}>
                      {payment.name}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>

            <p className="text-center mt-4 flex text-success-500">
              <p>الأموال التي في المحفظة :</p>
              {methodPayment && methodPayment.length > 0 ? (
                <>
                  {methodPayment.reduce(
                    (total, payment) =>
                      total +
                      (payment.name === selectedValueFrom && payment.money
                        ? payment.money.reduce(
                            (subTotal, item) => subTotal + +item.value,
                            0
                          )
                        : 0),
                    0
                  )}
                  <span className="ml-1">د.ل</span>
                </>
              ) : (
                <></>
              )}
            </p>

            {selectedValueFrom && (
              <Input
                type="number"
                color="warning"
                placeholder="أكتب المبلغ المراد تحويلة"
                className="border-1 border-warning-300 rounded-xl mt-4"
                onChange={handleInputSum}
                value={salaryFrom}
                startContent="د.ل"
              />
            )}
          </div>
          <Image src={exChange} alt={"error"} width={100} height={80} />
          <div className="border-1 w-[40%] border-warning-700 border-dashed rounded-3xl p-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  startContent={Icons.ArrowUturnDownIcon}
                  variant="bordered"
                  color="warning"
                  className="capitalize w-[100%] "
                >
                  {selectedValueTo}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeysTo}
                onSelectionChange={(keys: string[] | any) =>
                  handleSelectionChangeTo(keys)
                }
              >
                {methodPayment
                  .filter((payment) => payment.active === true)
                  .map((payment) => (
                    <DropdownItem key={payment.name}>
                      {payment.name}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>

            <p className="text-center mt-4 flex text-danger-400">
              <p>الأموال التي في المحفظة :</p>
              {methodPayment && methodPayment.length > 0 ? (
                <>
                  {methodPayment.reduce(
                    (total, payment) =>
                      total +
                      (payment.name === selectedValueTo && payment.money
                        ? payment.money.reduce(
                            (subTotal, item) => subTotal + +item.value,
                            0 + +salaryFrom
                          )
                        : 0),
                    0
                  )}
                </>
              ) : (
                <></>
              )}
              <p className="ml-1">د.ل</p>
            </p>
          </div>
        </div>
      </>
    );
  };

  const GetMethodPayment = async () => {
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get(`${linkServer.link}payment/getpayment`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMethodPayment(response.data.payment);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetMethodPayment();
  }, []);

  const SendMoney = async () => {
    try {
      const response = await axios.post(
        `${linkServer.link}payment/convertMoney`,
        {
          nameFrom: selectedValueFrom,
          nameTo: selectedValueTo,
          money: salaryFrom,
          employee: nameAdmin,
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
        window.location.reload();
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة حاول مره أخري ☹");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newSum = methodPayment.reduce(
      (total, payment) =>
        total +
        (payment.name === selectedValueFrom && payment.money
          ? payment.money.reduce((subTotal, item) => subTotal + +item.value, 0)
          : 0),
      0
    );

    setSum(newSum);
  }, [selectedValueFrom, methodPayment]);

  useEffect(() => {
    if (
      selectedValueFrom !== "إختر المحفظه ال تريد التحويل منها" &&
      selectedValueTo !== "إختر المحفظه ال تريد التحويل إليها" &&
      salaryFrom !== "" &&
      salaryFrom !== "0"
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [selectedValueFrom, selectedValueTo, salaryFrom, salaryTo]);

  useEffect(() => {
    if (selectedValueFrom === selectedValueTo) {
      alert("يجب أن لا تتشابه المحفظتين ✘");
      setSelectedKeysTo(["إختر المحفظه ال تريد التحويل إليها"]);
    } else {
      setCloseBtn(true);
    }
  }, [selectedValueFrom, selectedValueTo]);

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={Icons.ConvertIcon}
        color="warning"
        className="mt-4 h-14"
      >
        تحويل عملة
      </Button>
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
                <p> تحويل أموال من أي محفظه لأخري </p>
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={SendMoney}
                >
                  تحويل
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
