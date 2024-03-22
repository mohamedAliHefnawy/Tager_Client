import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import linkServer from "@/linkServer";

import { Cairo } from "next/font/google";
import faceBook from "@/public/img/facebook.png";
import linkenIn from "@/public/img/linkedin.png";
import telegram from "@/public/img/telegram.png";
import instagram from "@/public/img/instagram.png";

import { Avatar } from "@nextui-org/react";
import axios from "axios";
import Swal from "sweetalert2";

const cairo = Cairo({ subsets: ["arabic"] });

interface AmountData {
  [key: string]: number;
}

interface SizeData {
  [key: string]: { anchorKey: string };
}

export default function PrintInvoice({
  phoneCompany,
  colorCompany,
  amount,
  store,
  moneySafe,
  pos,
  size,
  deduct,
  products,
}: {
  phoneCompany: string | null;
  colorCompany: string | null;
  amount: { [key: string]: number };
  size: SizeData;
  deduct: Number;
  store: string;
  pos: string;
  moneySafe: string;
  products: {
    idProduct: string;
    nameProduct: string;
    imageProduct: string[];
    sizeProduct: {
      size: string;
      store: { nameStore: string; amount: number }[];
    }[];
    colorProduct: string;
    priceProduct: number;
    catogryProduct: string;
  }[];
}) {
  const printRef = useRef<HTMLFormElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const priceProducts = products.reduce(
    (clac, alt) => clac + amount[alt.idProduct] * alt.priceProduct,
    0
  );

  const orderInvoice = async () => {
    handlePrint();
    try {
      const data = {
        products,
        size,
        amount,
        deduct,
        store,
        moneySafe,
        pos,
        priceProducts,
      };

      const response = await axios.post(
        `${linkServer.link}Kasheer/orderInvoice`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم التحويل بنجاح",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {products.length > 0 ? (
        <div
          className="w-[100%] flex flex-col items-center mt-6 p-4 bg-warning-200 border-1 border-warning-500 rounded-full hover:cursor-pointer transform transition-transform hover:scale-90  "
          onClick={orderInvoice}
        >
          تأكيد الأوردر
        </div>
      ) : (
        <div className="w-[100%] flex flex-col items-center mt-6 p-4 bg-warning-200 border-1 border-warning-500 rounded-full opacity-70">
          تأكيد الأوردر
        </div>
      )}

      <div className="hidden">
        <form ref={printRef} className={cairo.className}>
          <div className="p-4 flex justify-between items-center">
            <p
              className="w-[5%] h-4"
              style={{ backgroundColor: `${colorCompany}` }}
            ></p>
            <p className="w-[45%] flex justify-center items-center">الحبايب</p>
            <p
              style={{ backgroundColor: `${colorCompany}` }}
              className="w-[50%] h-10 text-lg text-white font-bold flex justify-center items-center"
            >
              فاتورة
            </p>
          </div>
          <div className="my-7">
            <div
              className="flex justify-evenly items-center text-sm text-white p-4"
              style={{ backgroundColor: `${colorCompany}` }}
            >
              <p className="w-[20%] text-center">الإجمالي</p>
              <p className="w-[20%] text-center">الكميه</p>
              <p className="w-[20%] text-center">السعر</p>
              <p className="w-[20%] text-center">المقاس</p>
              <p className="w-[20%] text-center">المنتج</p>
            </div>
            {products.map((item, indexItem) => (
              <div
                key={indexItem}
                className="flex justify-evenly items-center text-sm p-4 border-b-1"
                style={{ borderBottom: `1px ${colorCompany} solid` }}
              >
                <p className="w-[20%] text-center">
                  {amount[item.idProduct] * item.priceProduct}
                </p>
                <p className="w-[20%] text-center">{amount[item.idProduct]}</p>
                <p className="w-[20%] text-center">{item.priceProduct}</p>
                <p className="w-[20%] text-center">
                  {size[item.idProduct] && size[item.idProduct].anchorKey}
                </p>
                <p className="w-[20%] text-center">{item.nameProduct}</p>
              </div>
            ))}

            <div className="text-sm p-4 ml-5 flex flex-col items-center justify-center w-28">
              <p className="flex font-bold">
                <p className="mr-1">د.ل</p>
                <p>{priceProducts}</p>
              </p>
              <p
                className="flex font-bold mt-2 p-3 text-center rounded-2xl text-white "
                style={{
                  backgroundColor: `${colorCompany}`,
                  outline: `1px double ${colorCompany}`,
                  border: `1px double white`,
                }}
              >
                <p className="mr-1">د.ل</p>
                <p>{priceProducts - (priceProducts * +deduct) / 100}</p>
              </p>
            </div>
            <div
              style={{ backgroundColor: `${colorCompany}` }}
              className="absolute bottom-0 mb-3 p-4 flex justify-evenly items-center ite w-[95%] text-white text-sm"
            >
              <div className="flex">
                <Avatar src={faceBook.src} size="sm" className="mr-2" />
                <Avatar src={telegram.src} size="sm" className="mr-2" />
                <Avatar src={linkenIn.src} size="sm" className="mr-2" />
                <Avatar src={instagram.src} size="sm" className="mr-2" />
              </div>
              <div>alhabieb@gmail.com</div>
              <div>{phoneCompany}</div>
            </div>
          </div>
        </form>

        <style jsx global>{`
          @media print {
            body {
              font-size: 30px;
              padding: 15px;
            }

            .non-printable {
              display: none;
            }

            form {
              width: 100%;
            }

            /* Add any additional print styles here */
          }
        `}</style>
      </div>
    </>
  );
}
