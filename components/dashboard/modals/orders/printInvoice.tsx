//react
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import QRCode from "qrcode.react";

//nextui
import { Avatar, Button, CheckboxGroup, Checkbox } from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { ArrowUturnDownIcon } from "../../../../public/svg/arrowUturnDownIcon";
import { ArrowspointinginIcon } from "../../../../public/svg/arrowspointinginIcon";
import { PrinterIcon } from "../../../../public/svg/printerIcon";

//images
import Hbaieb from "@/public/img/hbaieb.png";

export default function PrintInvoice({
  idOrder,
  imageCom,
  nameCom,
  colorCom,
  dateOrd,
  timeOrd,
  nameCli,
  addressCli,
  phone1Cli,
  phone2Cli,
  phoneMarketer,
  totalPriceOrder,
  allProducts,
}: {
  idOrder: String;
  imageCom: String;
  nameCom: String;
  colorCom: String;
  dateOrd: String;
  timeOrd: String;
  nameCli: String;
  addressCli: String;
  phone1Cli: String;
  phone2Cli: String;
  phoneMarketer: String;
  totalPriceOrder: number;
  allProducts: [
    {
      nameProduct: string;
      imageProduct: string;
      amount: number;
      price: number;
      size: string;
    }
  ];
}) {
  const icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
    ArrowspointinginIcon: <ArrowspointinginIcon />,
    PrinterIcon: <PrinterIcon />,
  };

  const printRef = useRef<HTMLFormElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <p
        onClick={handlePrint}
        className="hover:cursor-pointer hover:opacity-75 bg-primary-200 p-3 mt-1 rounded-full border-1 border-primary-600 text-primary-900"
      >
        {icons.PrinterIcon}
      </p>

      <div className="hidden">
        <form
          ref={printRef}
          className="flex w-[100%] flex-col justify-center p-8 rounded-lg "
        >
          <div className="flex justify-start items-center text-[30px]">
            {imageCom && nameCom ? (
              <>
                <Avatar src={`${imageCom}`} size="lg" />
                <p className=" text-slate-800 ml-2">{nameCom}</p>
              </>
            ) : (
              <>
                <p className="w-24 h-24">
                  <Image
                    src={Hbaieb}
                    alt="error"
                    width={70}
                    height={70}
                    className="rounded-full"
                  />
                </p>
                <p className=" text-slate-800 ml-2"> الحبايب </p>
              </>
            )}
          </div>
          <div className="flex justify-between items-center my-6">
            <div
              className={`w-[60%] h-16`}
              style={{ backgroundColor: `${colorCom ? colorCom : "#CCA330"} ` }}
            ></div>
            <p>
              {nameCom ? (
                <p className="text-[30px] text-slate-800"> {nameCom} </p>
              ) : (
                <p className="text-[30px] text-slate-800"> الحبايب</p>
              )}
            </p>
            <div
              className="w-[20%] h-16"
              style={{ backgroundColor: `${colorCom ? colorCom : "#CCA330"} ` }}
            ></div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <QRCode value={`${idOrder}`} />
            </div>
            <div className="flex flex-col items-end text-md">
              <p className="flex">
                <span className="mr-1">{nameCli}</span>
                <span> | الإسم </span>
              </p>
              <p className="flex">
                <span className="mr-1">{addressCli}</span>
                <span> | العنوان </span>
              </p>
              <p className="flex">
                <span className="mr-1">{phone1Cli}</span>
                <span> | رقم هاتف أساسي </span>
              </p>
              <p className="flex">
                <span className="mr-1">{phone2Cli}</span>
                <span> | رقم هاتف إحتياطي </span>
              </p>
              <p className="flex">
                <span className="mr-1">{dateOrd}</span>
                <span> | التاريخ </span>
              </p>
              <p className="flex">
                <span className="mr-1">{timeOrd}</span>
                <span> | الوقت </span>
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="border-1 border-slate-600">
              <div className="flex justify-evenly items-center bg-slate-700 text-slate-200">
                <p className="w-[20%] text-center">الإجمالي</p>
                <p className="w-[20%] text-center">الكمية</p>
                <p className="w-[20%] text-center">السعر</p>
                <p className="w-[20%] text-center">إسم المنتج</p>
              </div>
              {allProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-evenly items-center text-slate-600 p-2"
                >
                  <p className="w-[20%] text-center text-2xl">
                    {item.price * item.amount}
                  </p>
                  <p className="w-[20%] text-center text-2xl">{item.amount}</p>
                  <p className="w-[20%] text-center text-2xl">{item.price}</p>
                  <p className="w-[20%] text-center text-xl">
                    {item.nameProduct}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className=" w-[30%] h-20 flex items-center justify-center"
              style={{ backgroundColor: `${colorCom ? colorCom : "#CCA330"} ` }}
            >
              <span className="mr-2">د.ل</span>
              <span>{totalPriceOrder}</span>
            </div>
          </div>
          <div
            className={`h-16 absolute bottom-0 w-[92%] opacity-50 flex justify-evenly items-center`}
            style={{ backgroundColor: `${colorCom ? colorCom : "#CCA330"} ` }}
          >
            <p className="text-sm">faceBook | alhabieb.facebook</p>
            <p className="text-sm">phoneMarketer | {phoneMarketer}</p>
          </div>
        </form>

        <style jsx global>{`
          @media print {
            body {
              font-size: 35px;
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
