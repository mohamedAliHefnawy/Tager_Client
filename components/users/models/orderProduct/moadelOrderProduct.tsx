//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import linkServer from "@/linkServer";

//component
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";

//nextui
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

// imgaes
import product from "@/public/img/blue-t-shirt.jpg";

//svgIcon
import { DeleteIcon } from "../../../../public/svg/deleteIcon";
import { BanknotesIcon } from "../../../../public/svg/banknotesIcon";
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

export default function MoadelOrderProduct({
  nameUser,
  idProduct,
  nameProduct,
  priceProductRealy,
  priceProduct,
  gainProduct,
  imageProduct,
  sizeProduct,
  storeProduct,
  amountProduct,
}: {
  nameUser: string;
  idProduct: string;
  nameProduct: string;
  sizeProduct: null;
  priceProductRealy: number;
  priceProduct: number;
  gainProduct: number;
  amountProduct: number;
  imageProduct: string[];
  storeProduct: any;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stores, setStores] = useState<Stores[]>([]);
  const [nameClient, setNameClient] = useState("");
  const [phone1Client, setPhone1Client] = useState("");
  const [phone2Client, setPhone2Client] = useState("");
  const [addressClient, setAddressClient] = useState("");
  const [amountOrder, setAmountOrder] = useState("");
  const [priceOrder, setPriceOrder] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [imageURLCompany, setImageURLCompany] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [color, setColor] = useState("#FF6900");
  const [phoneCompany, setPhoneCompany] = useState("");

  const [selectedKeysTo, setSelectedKeysTo] = React.useState<string[]>([
    "إختر البلدة",
  ]);
  const selectedValueTo = React.useMemo(
    () => Array.from(selectedKeysTo).join(", ").replaceAll("_", " "),
    [selectedKeysTo]
  );

  const handleSelectionChangeTo = (selectedItems: string[]) => {
    setSelectedKeysTo(selectedItems);
  };
  const Icons = {
    DeleteIcon: <DeleteIcon />,
    BanknotesIcon: <BanknotesIcon />,
    ShoppingcartIcon: <ShoppingcartIcon />,
    HeartIcon: <HeartIcon />,
    HeartIcon2: <HeartIcon2 />,
    ArrowUturnDownIcon: <ArrowUturnDownIcon />,
  };

  const GetStores = async () => {
    try {
      let response: { data: { token: string; stores: any } };
      response = await axios.get(`${linkServer.link}stores/getStores`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setStores(response.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetStores();
  }, []);

  const amountStore = storeProduct
    .filter((item: any) => item.nameStore === selectedValueTo)
    .map((item: any) => item.amount);

  const priceDeliveryStore = stores
    .filter((item) => item.gbs === selectedValueTo)
    .map((item) => item.priceDelivery);

  const profitAdmin =
    +amountOrder * +priceProduct -
    +amountOrder * +priceProductRealy -
    +amountOrder * +gainProduct;

  const Body = () => {
    return (
      <>
        <div
          style={{ direction: "rtl" }}
          className="w-[100%] lg:flex md:block sm:block max-sm:block justify-center py-10"
        >
          <div className=" flex flex-col items-center lg:w-[65%] md:w-[100%] sm:w-[100%] max-sm:w-[100%]">
            <p>البيانات الشخصية</p>

            <div className=" lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%]">
              <input
                type="text"
                className="input"
                placeholder="الإسم بالكامل"
                value={nameClient}
                onChange={(e) => setNameClient(e.target.value)}
              />
            </div>
            <div className="lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%] flex">
              <input
                type="number"
                className="input ml-1"
                placeholder="رقم هاتف أساسي"
                value={phone1Client}
                onChange={(e) => setPhone1Client(e.target.value)}
              />
              <input
                type="number"
                className="input mr-1"
                placeholder="رقم هاتف إحتياطي"
                value={phone2Client}
                onChange={(e) => setPhone2Client(e.target.value)}
              />
            </div>
            <div className=" my-4">
              <p>بيانات التوصيل</p>
            </div>
            <div className="lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%]">
              <Dropdown className=" w-[100%]">
                <DropdownTrigger>
                  <Button
                    startContent={Icons.ArrowUturnDownIcon}
                    className={`w-[100%] border-1 ${
                      amountStore.length > 0
                        ? "border-warning-500"
                        : "border-danger-500"
                    }  bg-white`}
                  >
                    {selectedValueTo}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeysTo}
                  onSelectionChange={(keys: string[] | any) =>
                    handleSelectionChangeTo(keys)
                  }
                >
                  {stores.map((store) => (
                    <DropdownItem key={store.gbs}>{store.gbs}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <input
                type="text"
                className="input mr-1"
                placeholder="العنوان بالتفصيل"
                value={addressClient}
                onChange={(e) => setAddressClient(e.target.value)}
              />
            </div>
            <div className=" my-4">
              <p>بيانات المنتج</p>
            </div>
            <div className="lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%] flex">
              <input
                type="number"
                className="input ml-1"
                placeholder="الكمية"
                value={amountOrder}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (value <= +amountStore && value >= 0) {
                    setAmountOrder(e.target.value);
                  } else {
                    setAmountOrder("");
                  }
                }}
              />
              <input
                type="number"
                className="input mr-1 opacity-65"
                placeholder="سعر بيع القطعة"
                value={priceProduct}
                disabled
                // onChange={(e) => {
                //   const value = +e.target.value;
                //   if (value >= 0) {
                //     setPriceOrder(e.target.value);
                //   } else {
                //     setPriceOrder("");
                //   }
                // }}
              />
            </div>
          </div>
          <div className=" flex felx-col justify-center lg:w-[35%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] sm:px-0 max-sm:px-0 py-10 px-6 pl-16">
            <div className=" w-[100%]">
              <p className="bg-[var(--mainColor)] p-4 text-center">
                ملخص الطلب
              </p>
              <div className="flex items-center my-3">
                <div className="w-24 h-20 rounded-full">
                  <Image
                    src={imageProduct[0]}
                    alt="error"
                    className=" w-24 h-20 rounded-full"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="mr-4">
                  <p className="text-xl mb-2"> {nameProduct} </p>
                  <p>
                    {selectedValueTo === "إختر البلدة" ? (
                      <p>من فضلك إختر المكان</p>
                    ) : (
                      <p>
                        {/* متوفر
                        {amountStore.length > 0
                          ? amountStore[0] - +amountOrder
                          : 0}
                        <span className="mr-1">قطعة</span> */}
                        {amountStore.length > 0 ? (
                          <p className="text-success-600">متوفر</p>
                        ) : (
                          <p className="text-danger-600">غير متوفر</p>
                        )}
                      </p>
                    )}
                  </p>
                  <p className="flex items-center text-[var(--mainColor)] mt-2">
                    <span className="flex">
                      <p>{priceProduct}</p>
                      <p className="mr-1">د.ل</p>
                      {/* الربح : */}
                    </span>
                    {/* <span className="flex mr-1">
                      <p>{gainProduct}</p>
                      <p className="mr-1">د.ل</p>
                    </span> */}
                  </p>
                </div>
              </div>
              <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
              <div className="flex justify-between px-8 py-4">
                <p>سعر المنتجات ({amountOrder})</p>
                <p className="flex">
                  <p>{+amountOrder * +priceProduct}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>
              {/* <div className="flex justify-between px-8 py-4">
                <p> صافي الربح </p>
                <p className="flex">
                  <p>{+amountOrder * +gainProduct}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>
              <div className="flex justify-between px-8 py-4">
                <p> صافي الربح للادمن </p>
                <p className="flex">
                  <p>{(+amountOrder * +priceProduct ) - (+amountOrder * +priceProductRealy) - (+amountOrder * +gainProduct)}</p>
                  <p>{priceProductRealy}</p>
                  <p>{priceProduct}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div> */}
              {/* {profitAdmin} */}
              <div className="flex justify-between px-8 py-4">
                <p> سعر التوصيل </p>
                <p className="flex">
                  <p>{priceDeliveryStore}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>
              <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
              <div className="flex justify-between px-8 py-4">
                <p> الإجمالي </p>
                <p className="flex">
                  <p>{+amountOrder * +priceProduct + +priceDeliveryStore}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>

              <Button
                disabled={closeBtn}
                color={closeBtn ? "default" : "warning"}
                className="w-[100%]"
                variant="bordered"
                onClick={AddStore}
              >
                تــــــأكيد الطلب
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleSuccess = () => {
    setShowConfetti(true);
  };

  const AddStore = async () => {
    try {
      const data = {
        nameClient,
        phone1Client,
        phone2Client,
        store: selectedValueTo,
        address: addressClient,
        idProduct,
        imageProduct,
        sizeProduct,
        nameProduct,
        phoneCompany,
        nameCompany,
        imageURLCompany,
        color,
        amount: amountOrder,
        price: priceProduct,
        totalPriceProducts: +amountOrder * +priceProduct,
        gainMarketer:
          userValidity !== "مندوب تسويق" ? 0 : +amountOrder * +gainProduct,
        gainAdmin:
          userValidity !== "مندوب تسويق"
            ? +amountOrder * +gainProduct + profitAdmin
            : +profitAdmin,
        marketer: nameUser,
        deliveryPrice: priceDeliveryStore,
      };
      const response = await axios.post(
        `${linkServer.link}orders/addOrder`,
        data
      );
      if (response.data === "yes") {
        handleSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetDataUser = async () => {
    try {
      let response: { data: { token: string; user: any } };
      response = await axios.get(
        `${linkServer.link}users/getUser/${nameUser}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      setPhoneCompany(response.data.user.phoneCompany);
      setNameCompany(response.data.user.nameCompany);
      setImageURLCompany(response.data.user.imageCompany);
      setColor(response.data.user.colorCompany);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetDataUser();
  }, []);

  useEffect(() => {
    if (
      nameClient.trim() !== "" &&
      phone1Client.trim() !== "" &&
      amountOrder !== "" &&
      addressClient !== "" &&
      phone1Client.trim() !== "" &&
      phone2Client.trim() !== ""
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [nameClient, phone1Client, phone2Client, amountOrder, addressClient]);

  return (
    <>
      <Button
        onClick={onOpen}
        className="w-[100%] bg-slate-800 rounded-2xl text-white text-center"
      >
        أطلب الآن
      </Button>

      <Modal
        className="mt-10 p-0 max-h-screen overflow-y-auto"
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <NavBar
                  userr={nameUser}
                  lengthProductsInCart={0}
                  lengthProductsInFavourite={0}
                />
              </ModalHeader>
              <ModalBody>
                {showConfetti && <Confetti width={1300} height={1300} />}

                {Body()}
              </ModalBody>
              <ModalFooter>
                <Footer />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
