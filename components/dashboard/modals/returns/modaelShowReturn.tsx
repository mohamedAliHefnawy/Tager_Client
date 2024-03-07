//react
import React from "react";
import { ToastContainer } from "react-toastify";

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
} from "@nextui-org/react";

export default function ModaelShowReturn({
  products,
}: {
  products: [
    {
      idProduct: string;
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const Body = () => (
    <div className="p-10 flex flex-col items-center">
      <table className="w-[100%]">
        <tr className="border-1 border-warning-600 w-[100%] ">
          <th className="p-3 w-[10%]"> - </th>
          <th className="p-3 w-[20%] text-center"> إسم المنتج </th>
          <th className="p-3 w-[20%] text-center"> الحجم </th>
          <th className="p-3 w-[20%] text-center"> الكمية </th>
          <th className="p-3 w-[20%] text-center"> السعر </th>
          <th className="p-3 w-[20%] text-center"> الإجمالي </th>
        </tr>
        {products.length > 0 ? (
          products.map((item, indexItem) => (
            <tr
              key={indexItem}
              className="border-1 border-warning-600 w-[100%]"
            >
              <td className="p-3 w-[10%] ">
                <Avatar src={item.imageProduct} />
              </td>
              <td className="p-3 w-[20%] text-center"> {item.nameProduct} </td>
              <td className="p-3 w-[20%] text-center"> {item.size} </td>
              <td className="p-3 w-[20%] text-center"> {item.amount} </td>
              <td className="p-3 w-[20%] text-center"> {item.price} </td>
              <td className="p-3 w-[20%] text-center">
                {" "}
                {item.amount * item.price}{" "}
              </td>
            </tr>
          ))
        ) : (
          <p className="w-[100%] text-center "> لا يوجد منتجات </p>
        )}
      </table>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <Button
        onPress={onOpen}
        color="warning"
        className="opacity-90 rounded-full w-[100%]"
      >
        منتجات الطلبية
      </Button>
      <Modal
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>َ</ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
