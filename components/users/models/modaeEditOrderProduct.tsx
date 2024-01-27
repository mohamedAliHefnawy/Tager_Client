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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tab,
  Card,
  Tabs,
  CardBody,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";
import { ReceiptrefundIcon } from "@/public/svg/receiptrefundIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import { SearchIcon } from "@/public/svg/searchIcon";

// imgaes
import product from "@/public/img/blue-t-shirt.jpg";

export default function ModaeEditOrderProduct(props: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([
    "إختر طريقة الدفع",
  ]);
  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const handleSelectionChangeProducts = (selectedItems: any) => {
    if (Array.isArray(selectedItems)) {
      setSelectedProducts(selectedItems);
    } else {
      const keysArray = Array.from(selectedItems);
      const stringKeysArray = keysArray.map(String);
      setSelectedProducts(stringKeysArray);
    }
  };

  const selectedValueProducts = React.useMemo(
    () => Array.from(selectedProducts).join(", ").replaceAll("_", " "),
    [selectedProducts]
  );

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    ConvertIcon: <ConvertIcon />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
    ReceiptrefundIcon: <ReceiptrefundIcon />,
    PencilIcon: <PencilIcon />,
    SearchIcon: <SearchIcon />,
  };

  const body = () => {
    return (
      <>
        <div className="p-4">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            className="w-[100%]"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="بيانات العميل">
              <Card>
                <CardBody>
                  <div className=" flex flex-col items-center w-[100%] lg:max-h-80 md:max-h-80 sm:max-h-40 max-sm:max-h-40 overflow-y-auto">
                    <p>البيانات الشخصية</p>
                    <div className="w-[90%]">
                      <input
                        type="text"
                        className="input"
                        placeholder="الإسم بالكامل "
                        value="sdsdsd"
                      />
                    </div>
                    <div className="w-[90%] flex">
                      <input
                        type="text"
                        className="input mr-1"
                        placeholder="رقم هاتف أساسي"
                        value="01022222222"
                      />
                      <input
                        type="text"
                        className="input ml-1"
                        placeholder="رقم هاتف إحتياطي"
                        value="01022222222"
                      />
                    </div>
                    <div className=" my-4">
                      <p>بيانات التوصيل</p>
                    </div>
                    <div className="w-[90%]">
                      <Dropdown className="bg-[var(--mainColor)] w-[100%]">
                        <DropdownTrigger>
                          <Button
                            startContent={Icons.ArrowUturnDownIcon}
                            // variant="bordered"
                            color="default"
                            className="capitalize w-[100%] h-14 border-1 border-warning-500"
                          >
                            {/* {selectedValueProducts} */}
                            البحيره
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Single selection example"
                          variant="flat"
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={selectedProducts}
                          onSelectionChange={(keys: string[] | any) =>
                            handleSelectionChangeProducts(keys)
                          }
                        >
                          <DropdownItem>12</DropdownItem>
                          {/* {methodPayment
                    .filter((payment) => payment.active === true)
                    .map((payment) => (
                      <DropdownItem key={payment.name}>
                        {payment.name}
                      </DropdownItem>
                    ))} */}
                        </DropdownMenu>
                      </Dropdown>
                      <input
                        type="text"
                        className="input mr-1"
                        placeholder="العنوان بالتفصيل"
                        value="hgsfddsfkjdjdj"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="2" title="الطلبية">
              <Card>
                <CardBody>
                  <div className="lg:max-h-80 md:max-h-80 sm:max-h-40 max-sm:max-h-40 overflow-y-auto">
                    <div className="lg:flex md:flex sm:block max-sm:block items-center my-3">
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%] ">
                        <div className="w-24 h-20 rounded-full">
                          <Image
                            src={product}
                            alt="error"
                            className=" w-24 h-20 rounded-full"
                          />
                          <span className="relative bottom-9 text-3xl text-danger-600 hover:cursor-pointer">
                            ⤬
                          </span>
                        </div>
                        <div className="mr-4">
                          <p className="text-xl mb-2">تــيشيرت بني</p>
                          <p>متوفر 100 قطعة</p>
                          <p className="flex text-[var(--mainColor)] mt-2">
                            <p>100</p>
                            <p className="mr-1">د.ل</p>
                          </p>
                        </div>
                      </div>
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]  px-4">
                        <div className="w-32">
                          <input
                            type="number"
                            className="input"
                            placeholder="سعر البيع"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            className="input ml-1"
                            placeholder="الكمية"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
                    <div className="lg:flex md:flex sm:block max-sm:block items-center my-3">
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%] ">
                        <div className="w-24 h-20 rounded-full">
                          <Image
                            src={product}
                            alt="error"
                            className=" w-24 h-20 rounded-full"
                          />
                          <span className="relative bottom-9 text-3xl text-danger-600 hover:cursor-pointer">
                            ⤬
                          </span>
                        </div>
                        <div className="mr-4">
                          <p className="text-xl mb-2">تــيشيرت بني</p>
                          <p>متوفر 100 قطعة</p>
                          <p className="flex text-[var(--mainColor)] mt-2">
                            <p>100</p>
                            <p className="mr-1">د.ل</p>
                          </p>
                        </div>
                      </div>
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]  px-4">
                        <div className="w-32">
                          <input
                            type="number"
                            className="input"
                            placeholder="سعر البيع"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            className="input ml-1"
                            placeholder="الكمية"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
                    <div className="lg:flex md:flex sm:block max-sm:block items-center my-3">
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%] ">
                        <div className="w-24 h-20 rounded-full">
                          <Image
                            src={product}
                            alt="error"
                            className=" w-24 h-20 rounded-full"
                          />
                          <span className="relative bottom-9 text-3xl text-danger-600 hover:cursor-pointer">
                            ⤬
                          </span>
                        </div>
                        <div className="mr-4">
                          <p className="text-xl mb-2">تــيشيرت بني</p>
                          <p>متوفر 100 قطعة</p>
                          <p className="flex text-[var(--mainColor)] mt-2">
                            <p>100</p>
                            <p className="mr-1">د.ل</p>
                          </p>
                        </div>
                      </div>
                      <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%]  px-4">
                        <div className="w-32">
                          <input
                            type="number"
                            className="input"
                            placeholder="سعر البيع"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            className="input ml-1"
                            placeholder="الكمية"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="3" title="إضافة منتجات">
              <Card>
                <CardBody>
                  <div className=" max-h-60 overflow-y-auto">
                    <div className="mb-7 mr-2 flex justify-start">
                      <span className="relative top-10 left-10 opacity-50">
                        {Icons.SearchIcon}
                      </span>
                      <input
                        type="text"
                        className="input"
                        placeholder="... قم بالبحث "
                      />
                    </div>
                    <div className="flex lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] ">
                      <div className="gap-2 w-[100%] grid lg:grid-cols-3 md:sm:grid-cols-2 sm:sm:grid-cols-1 max-sm:sm:grid-cols-1">
                        <div className="flex mb-4 w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex mb-4 w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                        <div className="flex w-[100%] ">
                          <div className="w-24 h-20 rounded-full">
                            <Image
                              src={product}
                              alt="error"
                              className=" w-24 h-20 rounded-full"
                            />
                            <span className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer">
                              +
                            </span>
                          </div>
                          <div className="mr-4">
                            <p className="text-xl mb-2">تــيشيرت بني</p>
                            <p>متوفر 100 قطعة</p>
                            <p className="flex text-[var(--mainColor)]">
                              <p>100</p>
                              <p className="mr-1">د.ل</p>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  return (
    <>
      <p
        onClick={onOpen}
        className="bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)] p-4 rounded-full text-warning-800 hover:cursor-pointer mb-1"
      >
        {Icons.PencilIcon}
      </p>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300 fixed z-50"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ! تعديل طلبية
              </ModalHeader>
              <ModalBody>{body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                // color={closeBtn ? "default" : "primary"}
                // disabled={closeBtn}
                // onClick={BuyBroducts}
                >
                  تعديل الطلبية
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
