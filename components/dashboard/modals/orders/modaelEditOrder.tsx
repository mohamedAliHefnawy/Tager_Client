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
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { PencilIcon } from "../../../../public/svg/pencilIcon";

export default function ModaelEditOrder({
  idOrder,
  situationSteps,
}: // sendDataToParent,
{
  idOrder: string;
  situationSteps: [{ situation: string; date: string; time: string }];
  // sendDataToParent: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [selected, setSelected] = React.useState("1");
  const [situation, setSituation] = React.useState<
    { situation: string; date: string; time: string }[]
  >([]);

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    PencilIcon: <PencilIcon />,
  };

  const ChangeSituation = (newSituation: string) => {
    const newSituationItem = {
      situation: newSituation,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    const isAlreadySelected = situation.some(
      (item) => item.situation === newSituation
    );
    if (isAlreadySelected) {
      setSituation((prevSituation) =>
        prevSituation.filter((item) => item.situation !== newSituation)
      );
    } else {
      setSituation((prevSituation) => [...prevSituation, newSituationItem]);
    }

    if (newSituation === "تم القبول" || newSituation === "تم الرفض") {
      setSituation((prevSituation) =>
        prevSituation.filter(
          (item) =>
            item.situation !== "تم القبول" && item.situation !== "تم الرفض"
        )
      );
      setSituation((prevSituation) => [...prevSituation, newSituationItem]);
    }

    if (newSituation === "تم الإسترجاع" || newSituation === "تم التوصيل") {
      setSituation((prevSituation) =>
        prevSituation.filter(
          (item) =>
            item.situation !== "تم الإسترجاع" && item.situation !== "تم التوصيل"
        )
      );
      setSituation((prevSituation) => [...prevSituation, newSituationItem]);
    }

    if (newSituation === "تم الرفض") {
      setSituation((prevSituation) =>
        prevSituation.filter(
          (item) =>
            item.situation !== "مع الشحن" &&
            item.situation !== "تم التوصيل" &&
            item.situation !== "تم الإسترجاع" &&
            item.situation !== "إسترجاع جزئي" &&
            item.situation !== "تم إستلام الكاش"
        )
      );
      setSituation((prevSituation) => [...prevSituation, newSituationItem]);
    }
  };

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="حالة الطلبية">
              <Card>
                <CardBody className="p-10">
                  <div className="flex justify-center items-center">
                    <div>
                      <div className="flex justify-between items-center h-40">
                        <div className="flex flex-col items-center">
                          <div
                            className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                              situation.some(
                                (item) => item.situation === "بإنتظار الموافقة"
                              )
                                ? "bg-warning-100"
                                : ""
                            }`}
                            onClick={() => ChangeSituation("بإنتظار الموافقة")}
                          >
                            بإنتظار الموافقة
                          </div>
                          <p className="w-[100%] text-center">
                            {situation
                              .filter(
                                (item) => item.situation === "بإنتظار الموافقة"
                              )
                              .map((item2) => item2.date)}
                          </p>
                          <p className="w-[100%] text-center">
                            {situation
                              .filter(
                                (item) => item.situation === "بإنتظار الموافقة"
                              )
                              .map((item2) => item2.time)}
                          </p>
                        </div>

                        <div className="text-black text-lg pb-6">- - - - -</div>
                        <div className="flex flex-col items-center">
                          <div
                            className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                              situation.some(
                                (item) => item.situation === "تم القبول"
                              )
                                ? "bg-warning-100"
                                : ""
                            }`}
                            onClick={() => ChangeSituation("تم القبول")}
                          >
                            قبول
                          </div>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "تم القبول"
                            ) ? (
                              situation
                                .filter(
                                  (item) => item.situation === "تم القبول"
                                )
                                .map((item2) => item2.date)
                            ) : (
                              <p>-/--/----</p>
                            )}
                          </p>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "تم القبول"
                            ) ? (
                              situation
                                .filter(
                                  (item) => item.situation === "تم القبول"
                                )
                                .map((item2) => item2.time)
                            ) : (
                              <p>--:--</p>
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                              situation.some(
                                (item) => item.situation === "تم الرفض"
                              )
                                ? "bg-warning-100"
                                : ""
                            }`}
                            onClick={() => ChangeSituation("تم الرفض")}
                          >
                            الرفض
                          </div>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "تم الرفض"
                            ) ? (
                              situation
                                .filter((item) => item.situation === "تم الرفض")
                                .map((item2) => item2.date)
                            ) : (
                              <p>-/--/----</p>
                            )}
                          </p>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "تم الرفض"
                            ) ? (
                              situation
                                .filter((item) => item.situation === "تم الرفض")
                                .map((item2) => item2.time)
                            ) : (
                              <p>--:--</p>
                            )}
                          </p>
                        </div>

                        <div className="text-black text-lg pb-6">- - - - -</div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                              situation.some(
                                (item) => item.situation === "مع الشحن"
                              )
                                ? "bg-warning-100"
                                : ""
                            }`}
                            onClick={() => ChangeSituation("مع الشحن")}
                          >
                            مع الشحن
                          </div>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "مع الشحن"
                            ) ? (
                              situation
                                .filter((item) => item.situation === "مع الشحن")
                                .map((item2) => item2.date)
                            ) : (
                              <p>-/--/----</p>
                            )}
                          </p>
                          <p className="w-[100%] text-center">
                            {situation.some(
                              (item) => item.situation === "مع الشحن"
                            ) ? (
                              situation
                                .filter((item) => item.situation === "مع الشحن")
                                .map((item2) => item2.time)
                            ) : (
                              <p>--:--</p>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end items-center">
                        <div className="w-48 h-40 mb-6 border-3 border-e-0  border-dashed border-slate-600 opacity-75 rounded-s-full"></div>
                        <div>
                          <div className="flex items-center h-40">
                            <div className="flex flex-col items-center">
                              <div
                                className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                                  situation.some(
                                    (item) => item.situation === "إسترجاع جزئي"
                                  )
                                    ? "bg-warning-100"
                                    : ""
                                }`}
                                onClick={() => ChangeSituation("إسترجاع جزئي")}
                              >
                                إسترجاع جزئي
                              </div>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "إسترجاع جزئي"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "إسترجاع جزئي"
                                    )
                                    .map((item2) => item2.date)
                                ) : (
                                  <p>-/--/----</p>
                                )}
                              </p>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "إسترجاع جزئي"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "إسترجاع جزئي"
                                    )
                                    .map((item2) => item2.time)
                                ) : (
                                  <p>--:--</p>
                                )}
                              </p>
                            </div>
                            <div className="text-black text-lg pb-6">
                              - - - - -
                            </div>

                            <div className="flex flex-col items-center">
                              <div
                                className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                                  situation.some(
                                    (item) => item.situation === "تم الإسترجاع"
                                  )
                                    ? "bg-warning-100"
                                    : ""
                                }`}
                                onClick={() => ChangeSituation("تم الإسترجاع")}
                              >
                                تم الإسترجاع
                              </div>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم الإسترجاع"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "تم الإسترجاع"
                                    )
                                    .map((item2) => item2.date)
                                ) : (
                                  <p>-/--/----</p>
                                )}
                              </p>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم الإسترجاع"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "تم الإسترجاع"
                                    )
                                    .map((item2) => item2.time)
                                ) : (
                                  <p>--:--</p>
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col items-center">
                              <div
                                className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                                  situation.some(
                                    (item) => item.situation === "تم التوصيل"
                                  )
                                    ? "bg-warning-100"
                                    : ""
                                }`}
                                onClick={() => ChangeSituation("تم التوصيل")}
                              >
                                تم التوصيل
                              </div>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم التوصيل"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) => item.situation === "تم التوصيل"
                                    )
                                    .map((item2) => item2.date)
                                ) : (
                                  <p>-/--/----</p>
                                )}
                              </p>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم التوصيل"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) => item.situation === "تم التوصيل"
                                    )
                                    .map((item2) => item2.time)
                                ) : (
                                  <p>--:--</p>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center h-40">
                            <div className="flex flex-col items-center">
                              <div
                                className={`border-1 border-warning-200 w-36 h-16 rounded-full flex justify-center items-center hover:cursor-pointer hover:bg-warning-100 ${
                                  situation.some(
                                    (item) =>
                                      item.situation === "تم إستلام الكاش"
                                  )
                                    ? "bg-warning-100"
                                    : ""
                                }`}
                                onClick={() =>
                                  ChangeSituation("تم إستلام الكاش")
                                }
                              >
                                تم إستلام الكاش
                              </div>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم إستلام الكاش"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "تم إستلام الكاش"
                                    )
                                    .map((item2) => item2.date)
                                ) : (
                                  <p>-/--/----</p>
                                )}
                              </p>
                              <p className="w-[100%] text-center">
                                {situation.some(
                                  (item) => item.situation === "تم إستلام الكاش"
                                ) ? (
                                  situation
                                    .filter(
                                      (item) =>
                                        item.situation === "تم إستلام الكاش"
                                    )
                                    .map((item2) => item2.time)
                                ) : (
                                  <p>--:--</p>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="w-48 h-40 mb-6 border-3 border-s-0  border-dashed border-slate-600 opacity-75 rounded-e-full"></div>
                      <div className="h-40 w-48"></div>
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

  const EditOrder = async () => {
    setCloseBtn(true);
    try {
      const data = { idOrder: idOrder, situationOrder: situation };
      const response = await axios.post(
        "https://tager-server.vercel.app/orders/editOrderSituation",
        data
      );
      if (response.data === "yes") {
        // alert("تم تعديل الصنف بنجاح ✓");
        // sendDataToParent({
        //   orderId: order._id,
        //   data: situation[situation.length - 1].situation,
        // });
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

  useEffect(() => {
    if (situationSteps) {
      setSituation(situationSteps);
    }
  }, [situationSteps]);

  useEffect(() => {
    if (situation !== situationSteps && situationSteps[situationSteps.length - 1].situation !== "تم إستلام الكاش") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [situation]);



  return (
    <>
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 mt-1 rounded-full border-1 border-warning-600 text-warning-900"
      >
        {icons.PencilIcon}
      </p>
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
                تعديل الطلبية
              </ModalHeader>
              <ModalBody>{tabs()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={EditOrder}
                  onPress={onClose}
                >
                  تعديل
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
