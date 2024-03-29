//react
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

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
  Avatar,
} from "@nextui-org/react";
import Swal from "sweetalert2";

interface Stores {
  _id: string;
  name: string;
  details: [{ _id: string; gbs: string; price: number }];
}

interface Products {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

interface InputValues {
  [productId: string]: {
    price: number;
    quantity: number;
  };
}

interface ProfitPerProduct {
  [productId: string]: number;
}

export default function MoadelOrderProducts({
  nameUser,
  validityUser,
  Productss,
  sizeProductss,
}: {
  nameUser: string;
  validityUser: string;
  Productss: Products[];
  sizeProductss: Products[];
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [stores, setStores] = useState<Stores[]>([]);
  const [nameClient, setNameClient] = useState("");
  const [phone1Client, setPhone1Client] = useState("");
  const [phone2Client, setPhone2Client] = useState("");
  const [addressClient, setAddressClient] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [products, setProducts] = useState(Productss);
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [imageURLCompany, setImageURLCompany] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [color, setColor] = useState("#FF6900");
  const [phoneCompany, setPhoneCompany] = useState("");
  const [profitPerProduct, setProfitPerProduct] = useState<ProfitPerProduct>(
    {}
  );
  const [profitPerProductAdmin, setProfitPerProductAdmin] =
    useState<ProfitPerProduct>({});

  const [selectedKeysFrom, setSelectedKeysFrom] = React.useState<string[]>([
    "من",
  ]);
  const [selectedKeysTo, setSelectedKeysTo] = React.useState<string[]>(["إلي"]);

  const selectedValueFrom = React.useMemo(
    () => Array.from(selectedKeysFrom).join(", ").replaceAll("_", " "),
    [selectedKeysFrom]
  );

  const selectedValueTo = React.useMemo(
    () => Array.from(selectedKeysTo).join(", ").replaceAll("_", " "),
    [selectedKeysTo]
  );

  const handleSelectionChangeFrom = (selectedItems: string[]) => {
    setSelectedKeysFrom(selectedItems);
  };

  const handleSelectionChangeTo = (selectedItems: string[]) => {
    setSelectedKeysTo(selectedItems);
  };

  const Size = (id: any) => {
    return sizeProductss.find((item2) => item2[0] === id)?.[1];
  };

  const Amount = (productId: any) => {
    const amount =
      products
        .filter((item) => item._id === productId)
        .map(
          (item) =>
            item.size
              .filter((item2) => item2.size === Size(productId))
              .map((item3) =>
                item3.store
                  .filter((item4) => item4.nameStore === selectedValueFrom)
                  .map((item5) => item5.amount)[0] !== undefined
                  ? item3.store
                      .filter((item4) => item4.nameStore === selectedValueFrom)
                      .map((item5) => item5.amount)[0]
                  : 0
              )[0] || 0
        )[0] || 0;

    return amount;
  };

  const DeleteProductWithCart = (id: any) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);
  };

  const handleInputChange = (
    productId: string,
    field: string,
    value: string,
    price3: number,
    price2: number,
    price1: number,
    gainMarketer: number
  ) => {
    const currentInputValues = (inputValues as InputValues)[productId] || {
      price: 0,
      quantity: 0,
    };
    const priceValue = field === "price" ? value : currentInputValues.price;
    const quantityValue =
      field === "quantity" ? value : currentInputValues.quantity;

    const priceVall = userValidity !== "مندوب تسويق" ? price3 : price2;

    if (
      +quantityValue >= 0 &&
      +quantityValue <= Amount(productId) &&
      +priceValue >= 0
    ) {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [productId]: {
          ...currentInputValues,
          [field]: value,
        },
      }));

      const amountOrder = +quantityValue * +priceValue;
      const profit = gainMarketer * +quantityValue;
      const profitAdmin = (+priceVall - +price1) * +quantityValue - +profit;
      setTotalAmount((prevTotalAmount) => {
        const updatedTotalAmount =
          prevTotalAmount -
          currentInputValues.price * currentInputValues.quantity +
          amountOrder;
        return updatedTotalAmount;
      });

      setProfitPerProduct((prevProfitPerProduct) => {
        const updatedProfitPerProduct: ProfitPerProduct = {
          ...prevProfitPerProduct,
          [productId]: profit,
        };
        return updatedProfitPerProduct;
      });

      setProfitPerProductAdmin((prevProfitPerProduct) => {
        const updatedProfitPerProduct: ProfitPerProduct = {
          ...prevProfitPerProduct,
          [productId]: profitAdmin,
        };
        return updatedProfitPerProduct;
      });
    }
  };

  const totalProfit = Object.values(profitPerProduct).reduce(
    (acc, profit) => acc + profit,
    0
  );
  const totalProfitAdmin = Object.values(profitPerProductAdmin).reduce(
    (acc, profit) => acc + profit,
    0
  );

  const amountStore = stores
    .filter((item: any) => item.nameStore === selectedValueFrom)
    .map((item: any) => item.amount);

  const priceDeliveryStore =
    stores
      .find((item) => item.name === selectedValueFrom)
      ?.details.find((item) => item.gbs === selectedValueTo)?.price ?? 0;

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
            <div className="lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%] flex">
              <Dropdown className=" w-[100%]">
                <DropdownTrigger>
                  <Button
                    // startContent={Icons.ArrowUturnDownIcon}
                    className={`w-[100%] mr-2 border-1 bg-white`}
                  >
                    {selectedValueFrom}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKeysFrom}
                  onSelectionChange={(keys: string[] | any) =>
                    handleSelectionChangeFrom(keys)
                  }
                >
                  {stores.map((store) => (
                    <DropdownItem key={store.name}>{store.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown className=" w-[100%]">
                <DropdownTrigger>
                  <Button
                    // startContent={Icons.ArrowUturnDownIcon}
                    className={`w-[100%] mr-2 border-1 bg-white`}
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
                  {stores
                    .filter((filt) => filt.name === selectedValueFrom)
                    .flatMap((store) =>
                      store.details.map((item) => (
                        <DropdownItem key={item.gbs}>{item.gbs}</DropdownItem>
                      ))
                    )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className=" lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%]">
              <input
                type="text"
                className="input mr-1"
                placeholder="العنوان بالتفصيل"
                value={addressClient}
                onChange={(e) => setAddressClient(e.target.value)}
              />
            </div>
          </div>
          <div className=" flex felx-col justify-center lg:w-[35%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] sm:px-0 max-sm:px-0 py-10 px-6 pl-16">
            <div className=" w-[100%]">
              <p className="bg-[var(--mainColor)] p-4 text-center">
                ملخص الطلب
              </p>

              <div className="max-h-96 overflow-y-scroll">
                {products.map((item, index) => (
                  <div key={index} className="flex items-center my-3">
                    <div key={item._id} className="flex w-[50%]">
                      {/* {Amount(item._id)} */}
                      <div className="w-24 h-20 rounded-full">
                        <Avatar src={item.image[0]} size="lg" />
                        <p
                          className="text-danger-600 hover:cursor-pointer w-5"
                          onClick={() => DeleteProductWithCart(item._id)}
                        >
                          ⤫
                        </p>
                      </div>
                      <div className="mr-4">
                        <p className="text-xl mb-2">{item.name}</p>
                        {Size(item._id)}

                        <p>
                          {item.size
                            .filter((item2) => item2.size === Size(item._id))
                            .map((item3, index3) => (
                              <p key={index3}>
                                {item3.store
                                  .filter(
                                    (item4) =>
                                      item4.nameStore === selectedValueFrom
                                  )
                                  .map((item5, index5) =>
                                    item5.amount !== undefined ? (
                                      <p
                                        key={index5}
                                        className="text-success-600"
                                      >
                                        <span className="ml-1">متوفر</span>
                                      </p>
                                    ) : (
                                      <p
                                        key={index5}
                                        className="text-danger-600"
                                      >
                                        <span className="ml-1">متوفر</span>0
                                        <span className="mr-1">قطعة</span>
                                      </p>
                                    )
                                  )}
                              </p>
                            ))}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-[50%]  px-4">
                      <div className="w-32">
                        <input
                          type="number"
                          className="input opacity-65"
                          placeholder="سعر البيع"
                          value={
                            (inputValues[item._id] &&
                              inputValues[item._id].price) ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item._id,
                              "price",
                              userValidity !== "مندوب تسويق"
                                ? item.price3
                                : item.price2,
                              item.price3,
                              item.price2,
                              item.price1,
                              item.gainMarketer
                            )
                          }
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          className="input mr-1"
                          placeholder="الكمية"
                          disabled={selectedValueFrom === "من"}
                          value={
                            inputValues[item._id] &&
                            inputValues[item._id].quantity
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item._id,
                              "quantity",
                              e.target.value,
                              item.price3,
                              item.price2,
                              item.price1,
                              item.gainMarketer
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
              <div className="flex justify-between px-8 py-4">
                <p>سعر المنتجات ({products.length})</p>
                <p className="flex">
                  <p>{totalAmount}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>

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
                  <p>{+totalAmount + +priceDeliveryStore}</p>
                  <p className="mr-1">د.ل</p>
                </p>
              </div>

              <Button
                disabled={closeBtn}
                color={closeBtn ? "default" : "warning"}
                className="w-[100%]"
                variant="bordered"
                onClick={AddOrder}
              >
                تــــــأكيد الطلب
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const AddOrder = async () => {
    Swal.fire({
      icon: "success",
      title: "تم عمل الطلبية بنجاح",
      text: "✓",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "حسنًا",
      position: "top-right",
      timer: 4000,
      timerProgressBar: true,
      toast: true,
      showConfirmButton: false,
    });
    // router.push("/orders");
    setCloseBtn(true);

    try {
      const data = {
        nameClient,
        phone1Client,
        phone2Client,
        store: selectedValueFrom,
        address: addressClient,
        userValidity,
        products,
        sizes: sizeProductss,
        amountAndPrice: inputValues,
        phoneCompany,
        nameCompany,
        imageURLCompany,
        color,
        totalPriceProducts: +totalAmount + +priceDeliveryStore,
        gainMarketer: userValidity !== "مندوب تسويق" ? 0 : +totalProfit,
        gainAdmin:
          userValidity !== "مندوب تسويق"
            ? +totalProfit + +totalProfitAdmin
            : +totalProfitAdmin,
        marketer: nameUser,
        deliveryPrice: priceDeliveryStore,
      };
      const response = await axios.post(
        `${linkServer.link}orders/addOrderProducts`,
        data
      );
      // if (response.data === "yes") {
      //   router.push("/orders");
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const GetDataUser = useCallback(async () => {
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
  }, [nameUser, setPhoneCompany, setNameCompany, setImageURLCompany, setColor]);

  useEffect(() => {
    GetDataUser();
  }, [GetDataUser]);

  useEffect(() => {
    if (Productss) {
      setProducts(Productss);
    }
  }, [Productss]);

  useEffect(() => {
    if (
      nameClient.trim() !== "" &&
      addressClient !== "" &&
      phone1Client.trim() !== "" &&
      phone2Client.trim() !== ""
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [nameClient, phone1Client, phone2Client, addressClient]);

  return (
    <>
      <div className="p-12 py-8 mr-2 h-auto flex justify-center items-center ">
        <div className="bg-orange-200 w-4 h-4 rotate-45 mt-1 rounded-lg"></div>
        <div
          onClick={onOpen}
          className="bg-orange-200 p-4 rounded-lg hover:cursor-pointer"
        >
          إستكمال الطلب
        </div>
      </div>

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
