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
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";

export default function ModaelPullMoney(props: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([
    "إختر طريقة الدفع",
  ]);

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
  };

  const body = () => {
    return (
      <>
        <div className="p-4">
          <input
            type="text"
            className="input"
            placeholder="المبلغ المراد سحبة"
          />
          <div className="my-3 flex items-center">
            <input
              type="number"
              className="input mr-2"
              placeholder="رقم الهاتف"
            />
            <Dropdown className="bg-[var(--mainColor)] w-[200%] relative right-24">
              <DropdownTrigger>
                <Button
                  startContent={Icons.ArrowUturnDownIcon}
                  variant="bordered"
                  color="warning"
                  className="capitalize w-[100%] h-16 mt-5"
                >
                  {selectedValueProducts}
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
          </div>
        </div>
      </>
    );
  };

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
                // color={closeBtn ? "default" : "primary"}
                // disabled={closeBtn}
                // onClick={BuyBroducts}
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
