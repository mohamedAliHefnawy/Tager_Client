//react
import React from "react";

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

export default function ModaelStepsPaymentpurchases({
  paymentSteps,
  products,
}: {
  paymentSteps: [
    { _id: string; price: string; employee: string; date: string; time: string }
  ];
  products: [
    {
      _id: string;
      name: string;
      image: string;
      price: string;
      amount: string;
      details: [
        { size: string; store: [{ nameStore: string; amount: number }] }
      ];
    }
  ];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <p
        onClick={onOpen}
        className="mt-4 text-center hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 rounded-full border-1 border-warning-600 text-warning-900"
      >
        سجل الدفع
      </p>

      <Modal size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                ! سجل دفع
              </ModalHeader>

              <ModalBody>
                <div className="p-16">
                  <div className="flex justify-evenly border-1 border-slate-500 py-4">
                    <p>وقت الدفع</p>
                    <p>تاريخ الدفع</p>
                    <p>المبلغ</p>
                    <p>الموظف</p>
                  </div>

                  {paymentSteps &&
                    paymentSteps.length > 0 &&
                    paymentSteps.map((item, index) => (
                      <p key={index}>
                        <div className="flex justify-evenly items-center border-1 mt-2 border-slate-500 py-4">
                          <p className="mt-4">{item.time}</p>
                          <p className="mt-4">{item.date}</p>
                          <p className="flex mt-4">
                            <p className="mr-1">د.ل</p>
                            <p>{item.price}</p>
                          </p>
                          <p className="mt-4">{item.employee}</p>
                        </div>
                      </p>
                    ))}
                </div>
              </ModalBody>

              <div className="w-[100%] p-10">
                <div className="border-1 border-orange-300 flex flex-col items-end w-[35%] p-4 rounded-2xl">
                  {products.map((item, index) => (
                    <div key={index}>
                      <p className="mb-3 flex items-center">
                        <div>
                          <p className="flex">
                            <span>
                              {item.details.map((item2, index2) => (
                                <p key={index2} className="my-2">
                                  {item2.store.map((item3, index3) => (
                                    <p key={index3} className="flex mr-3">
                                      <span className="mr-1 font-bold">
                                        {item2.size}
                                      </span>
                                      <span className="mr-1">من الحجم</span>
                                      <span className="font-bold mr-1">
                                        {item3.nameStore}
                                      </span>
                                      <span className="mr-1">
                                        قد تم وضعهم في
                                      </span>
                                      <span className="mr-1">قطعة</span>
                                      <p className="font-bold">
                                        {item3.amount}
                                      </p>
                                    </p>
                                  ))}
                                </p>
                              ))}
                            </span>
                          </p>
                        </div>
                        <Avatar src={item.image} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>

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
