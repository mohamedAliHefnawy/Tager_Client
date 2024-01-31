//react
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

//nextui
import { Button, CheckboxGroup, Checkbox } from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { ArrowUturnDownIcon } from "../../../../public/svg/arrowUturnDownIcon";
import { ArrowspointinginIcon } from "../../../../public/svg/arrowspointinginIcon";
import { PrinterIcon } from "../../../../public/svg/printerIcon";

//images
// import Logo from "../../../../public/img/logo.png";

export default function PrintInvoice({
  day,
  time,
  doctor,
  patient,
}: {
  day: String;
  time: String;
  doctor: String;
  patient: String;
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

  function formatTimeTo12Hour(time: String) {
    const date = new Date(`2000-01-01T${time}`);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  }

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
          className="flex w-[100%] flex-col justify-center p-4 rounded-lg "
        >
          <div className="w-[100%] flex justify-center">
            {/* <Image src={Logo} alt="error" width={350} height={325} /> */}
          </div>
          <div className="w-[100%] h-1 bg-slate-400 rounded-full"></div>
          <div className="flex justify-end items-center text-2xl mt-5">
            <p className="mr-2">{day}</p>
            <p>: اليوم </p>
          </div>
          <div className="flex justify-end items-center text-2xl mt-5">
            <p className="mr-2">{formatTimeTo12Hour(time)}</p>
            <p>: الوقت </p>
          </div>
          <div className="flex justify-end items-center text-2xl mt-5">
            <p className="mr-2">{doctor}</p>
            <p>: الدكتور </p>
          </div>
          <div className="flex justify-end items-center text-2xl mt-5">
            <p className="mr-2">{patient}</p>
            <p>: اسم الحالة </p>
          </div>
          <div className=" w-[100%] mt-10">
            <table className="border-1 border-slate-500 w-[100%]">
              <tr className="border-1 border-slate-500">
                <td className="border-1 border-slate-500 p-4 text-center">
                  إسم الخدمة
                </td>
                <td className="border-1 border-slate-500 p-4 text-center">
                  السعر
                </td>
              </tr>
              {/* {servises.map((item, index) => (
                <tr key={index} className="border-1 border-slate-500">
                  <td className="border-1 border-slate-500 p-4 text-center">
                    {item.nameService}
                  </td>
                  <td className="border-1 border-slate-500 p-4 text-center">
                    {item.priceService.toString()}
                  </td>
                </tr>
              ))} */}
            </table>
            <div className="p-4 flex justify-end">
              <div className="w-[36%] text-center bg-orange-400 p-4">
                <span className="felx">
                  <span>
                    {/* {servises.reduce(
                      (acc, entry) =>
                        acc + parseFloat(entry.priceService.toString()),
                      0
                    )} */}
                  </span>
                  <span className="ml-1">د.ل</span>
                </span>
              </div>
            </div>
          </div>
        </form>

        <style jsx global>{`
          @media print {
            body {
              font-size: 12pt;
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
