//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUnixTime } from "date-fns";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";
import { TwitterPicker } from "react-color";
import faceBook from "@/public/img/facebook.png";
import linkenIn from "@/public/img/linkedin.png";
import telegram from "@/public/img/telegram.png";
import instagram from "@/public/img/instagram.png";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Pagination,
  Slider,
  Avatar,
} from "@nextui-org/react";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents
import { analytics } from "@/fireBase/fireBaseConfig";
import Swal from "sweetalert2";

interface Invoices {
  _id: string;
  products: [
    {
      Idproduct: string;
      nameProduct: string;
      sizeProduct: string;
      amountProduct: number;
      priceProduct: number;
      _id: string;
    }
  ];
  totalPrice: number;
  deduct: number;
  dateInvoice: string;
  timeInvoice: string;
}

export default function InvoicePosModel() {
  const AdminPos = localStorage.getItem("nameKasheer");
  const phoneCompaneyPos = localStorage.getItem("phoneCompanyKasheer");
  const colorCompanyPos = localStorage.getItem("colorCompanyKasheer");

  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [invoices, setInvoices] = useState<Invoices[]>([]);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };
  const filteredInvoices = invoices.filter((order) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      order.dateInvoice &&
      order.dateInvoice.toLowerCase().includes(lowerCaseSearchText)
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${linkServer.link}Kasheer/getInvoicekasheer/${AdminPos}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      setInvoices(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Table = () => {
    return (
      <>
        <div>
          <div>
            {/* <input
              type="text"
              placeholder=" بحث ..."
              className="w-[90%] input"
              onChange={handleSearchChange}
              value={searchText}
            /> */}
            {/* <Slider
              key={sm}
              radius=~~~~~
              step={0.01}
              maxValue={1}
              minValue={0}
              defaultValue={0.7}
              aria-label="Temperature"
              className="max-w-md"
            /> */}
          </div>
          <div className="grid gap-3 grid-cols-4">
            {filteredInvoices.map((item, indexItem) => (
              <div
                key={indexItem}
                className="mb-4 rounded-2xl p-4"
                style={{ outline: `1px double ${colorCompanyPos}` }}
              >
                <div className="p-4 flex justify-between items-center">
                  <p
                    className="w-[5%] h-4"
                    style={{ backgroundColor: `${colorCompanyPos}` }}
                  ></p>
                  <p className="w-[45%] flex justify-center items-center">
                    الحبايب
                  </p>
                  <p
                    style={{ backgroundColor: `${colorCompanyPos}` }}
                    className="w-[50%] h-10 text-lg text-white font-bold flex justify-center items-center"
                  >
                    فاتورة
                  </p>
                </div>
                <div className="my-7">
                  <div
                    className="flex justify-evenly items-center text-sm text-white p-4"
                    style={{ backgroundColor: `${colorCompanyPos}` }}
                  >
                    <p className="w-[20%] text-center">الإجمالي</p>
                    <p className="w-[20%] text-center">الكميه</p>
                    <p className="w-[20%] text-center">السعر</p>
                    <p className="w-[20%] text-center">المقاس</p>
                    <p className="w-[20%] text-center">المنتج</p>
                  </div>
                  {item.products.map((item2) => (
                    <div
                      key={indexItem}
                      className="flex justify-evenly items-center text-sm p-4 border-b-1"
                      style={{ borderBottom: `1px ${colorCompanyPos} solid` }}
                    >
                      <p className="w-[20%] text-center">
                        {item2.amountProduct * item2.priceProduct}
                      </p>
                      <p className="w-[20%] text-center">
                        {item2.amountProduct}
                      </p>
                      <p className="w-[20%] text-center">
                        {item2.priceProduct}
                      </p>
                      <p className="w-[20%] text-center">{item2.sizeProduct}</p>
                      <p className="w-[20%] text-center">{item2.nameProduct}</p>
                    </div>
                  ))}

                  <div className="text-sm p-4 flex flex-col items-center justify-center w-28">
                    <p className="flex font-bold">
                      <p className="mr-1">د.ل</p>
                      <p>{item.totalPrice}</p>
                    </p>
                    <p
                      className="flex font-bold mt-2 p-3 text-center rounded-2xl text-white "
                      style={{
                        backgroundColor: `${colorCompanyPos}`,
                        outline: `1px double ${colorCompanyPos}`,
                        border: `1px double white`,
                      }}
                    >
                      <p className="mr-1">د.ل</p>
                      <p>
                        {item.totalPrice -
                          (item.totalPrice * +item.deduct) / 100}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination">
          <Pagination
            className=" mb-3"
            showShadow
            color="primary"
            variant="faded"
            total={Math.ceil(filteredInvoices.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <p
        className="p-4 opacity-90 text-black flex flex-col items-center hover:font-bold hover:cursor-pointer transform transition-transform hover:scale-90 hover:animate-pulse text-lg"
        onClick={onOpen}
      >
        <p className="text-lg">{Icons.TagIcon}</p>
        <p className="block hover:font-bold">فواتير</p>
      </p>
      <Modal
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
        className="max-h-screen overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center w-[100%] ">
                <p className="flex items-center">
                  <p className="mr-2">فواتير الكاشير</p>
                  <p>{Icons.MapIcon}</p>
                </p>
              </ModalHeader>
              <ModalBody>{Table()}</ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>شـــــكراَ</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
