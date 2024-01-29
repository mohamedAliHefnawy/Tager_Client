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
  Tab,
  Card,
  Tabs,
  CardBody,
  Avatar,
  Spinner,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ConvertIcon } from "@/public/svg/convertIcon";
import { ArrowUturnDownIcon } from "@/public/svg/arrowUturnDownIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";
import { ReceiptrefundIcon } from "@/public/svg/receiptrefundIcon";
import { PencilIcon } from "@/public/svg/pencilIcon";
import { SearchIcon } from "@/public/svg/searchIcon";

// imgaes
import product from "@/public/img/blue-t-shirt.jpg";

interface Products {
  idProduct: string;
  _id: string;
  name: string;
  price2: string;
  price3: string;
  catogry: string;
  nameProduct: string;
  imageProduct: string;
  products: [{ image: string }];
  amount: number;
  price: number;
  size: string;
  image: string;
}

export default function ModaeEditOrderProduct({
  id,
  userr,
  name,
  phone1,
  phone2,
  addres,
  store,
  produts,
}: {
  id: string;
  userr: string;
  name: string;
  phone1: string;
  phone2: string;
  addres: string;
  store: string;
  produts: Products[];
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [closeBtn, setCloseBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nameClient, setNameClient] = useState(name);
  const [phone1Client, setPhone1Client] = useState(phone1);
  const [phone2Client, setPhone2Client] = useState(phone2);
  const [address, setAddress] = useState(addres);
  const [produtss, setProdutss] = useState<Products[]>([]);
  const [allProduts, setAllProduts] = useState<Products[]>([]);
  const [allProduts2, setAllProduts2] = useState<Products[]>([]);
  const [newProducts, setNewProducts] = useState<Products[]>([]);
  const [newProducts2, setNewProducts2] = useState<Products[]>([]);
  const [selectedSize, setSelectedSize] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 6;
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([
    "إختر طريقة الدفع",
  ]);
  const [selected, setSelected] = React.useState("1");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

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
    ReceiptrefundIcon: <ReceiptrefundIcon />,
    PencilIcon: <PencilIcon />,
    SearchIcon: <SearchIcon />,
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProducts = allProduts.filter((product) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (product.name &&
        product.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (product.catogry &&
        product.catogry.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const RomveProducWithOrder = (id: any) => {
    const filteredProducts = produtss.filter((item) => item.idProduct !== id);
    const isIdInProducts = newProducts2.some(
      (product) => product.idProduct === id
    );
    const deletedProduct = newProducts2.find(
      (product) => product.idProduct === id
    );

    setProdutss(filteredProducts);
    if (isIdInProducts) {
      setNewProducts((prevProducts) => [
        ...prevProducts,
        {
          idProduct: id,
          amount: deletedProduct?.amount,
          size: deletedProduct?.size,
        },
      ]);
    }
  };

  const AddProductWithOrder = (id: string) => {
    const productToAdd = allProduts2.find((item) => item._id === id);
    const AllProductsFiltred = allProduts2.filter((item) => item._id !== id);

    if (productToAdd) {
      setAllProduts2(AllProductsFiltred);
      setProdutss((prevProducts) => [
        ...prevProducts,
        {
          idProduct: productToAdd._id,
          nameProduct: productToAdd.name,
          imageProduct: productToAdd.image[0],
          amount: 1,
          price: productToAdd.price1,
          size: selectedSize,
          _id: id,
        },
      ]);
    }
  };

  const body = () => {
    return (
      <>
        <div className="p-4">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            className="w-[100%]"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="بيانات العميل">
              <Card>
                <CardBody>
                  <div className=" flex flex-col items-center w-[100%] lg:max-h-80 md:max-h-80 sm:max-h-40 max-sm:max-h-40 overflow-y-auto">
                    <p>البيانات الشخصية</p>
                    <div className="w-[90%]">
                      <input
                        type="text"
                        className="input"
                        placeholder="الإسم بالكامل "
                        value={nameClient}
                        onChange={(e) => setNameClient(e.target.value)}
                      />
                    </div>
                    <div className="w-[90%] flex">
                      <input
                        type="text"
                        className="input mr-1"
                        placeholder="رقم هاتف أساسي"
                        value={phone1Client}
                        onChange={(e) => setPhone1Client(e.target.value)}
                      />
                      <input
                        type="text"
                        className="input ml-1"
                        value={phone2Client}
                        placeholder="رقم هاتف 2"
                        onChange={(e) => setPhone2Client(e.target.value)}
                      />
                    </div>
                    <div className=" my-4">
                      <p>بيانات التوصيل</p>
                    </div>
                    <div className="w-[90%]">
                      <Button
                        color="default"
                        className="capitalize w-[100%] h-14 border-1 border-warning-500"
                      >
                        {store}
                      </Button>
                      <input
                        type="text"
                        className="input mr-1"
                        placeholder="العنوان بالتفصيل"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="2" title="الطلبية">
              <Card>
                <CardBody>
                  {produtss.length > 0 ? (
                    produtss.map((item, index) => (
                      <div key={index}>
                        <div className="lg:flex md:flex sm:block max-sm:block items-center my-3">
                          <div className="flex lg:w-[50%] md:w-[50%] sm:w-[100%] max-sm:w-[100%] ">
                            <div className="w-24 h-20 rounded-full">
                              <Avatar size="lg" src={item.imageProduct} />
                              <span
                                onClick={() =>
                                  RomveProducWithOrder(item.idProduct)
                                }
                                className="relative bottom-9 text-3xl text-danger-600 hover:cursor-pointer"
                              >
                                ⤬
                              </span>
                            </div>
                            <div className="mr-4">
                              <p className="text-xl mb-2">{item.nameProduct}</p>
                              <p className="flex">
                                <span className="mr-1">قطعة</span>
                                <span>{item.amount}</span>
                              </p>
                              <p> {item.size} </p>
                              <p className="flex text-[var(--mainColor)] mt-2">
                                <p className="mr-1">د.ل</p>
                                <p>{item.price}</p>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-[100%] h-[1px] bg-[var(--mainColor)]"></div>
                      </div>
                    ))
                  ) : (
                    <p className="w-[100%]">لا يوجد منتجات</p>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab key="3" title="إضافة منتجات">
              <Card>
                <CardBody>
                  {loading ? (
                    <div className="flex justify-center items-center h-[400px]">
                      <Spinner size="lg" color="warning" />
                    </div>
                  ) : allProduts.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      <div className="mb-7 mr-2 flex justify-start">
                        <span className="relative top-10 left-10 opacity-50">
                          {Icons.SearchIcon}
                        </span>
                        <input
                          type="text"
                          className="input"
                          placeholder="... قم بالبحث "
                          onChange={handleSearchChange}
                          value={searchText}
                        />
                      </div>
                      <div className="gap-2 w-[100%] grid lg:grid-cols-3 md:sm:grid-cols-2 sm:sm:grid-cols-1 max-sm:sm:grid-cols-1">
                        {allProduts2.map((product, index) => (
                          <div key={index}>
                            <div className="flex mb-4 w-[100%] ">
                              <div className="w-24 h-20 rounded-full">
                                <Avatar size="lg" src={product.image} />
                                <span
                                  onClick={() =>
                                    AddProductWithOrder(product._id)
                                  }
                                  className="relative bottom-9 text-3xl text-success-600 hover:cursor-pointer"
                                >
                                  +
                                </span>
                              </div>
                              <div className="mr-4">
                                <p className="text-xl mb-2">{product.name}</p>
                                <p className="flex">
                                  {product.size.map((item) => (
                                    <p
                                      onClick={() => setSelectedSize(item.size)}
                                      className={`mr-2  ${
                                        item.size === selectedSize
                                          ? "bg-warning-200"
                                          : "bg-warning-50"
                                      } p-1 px-3 rounded-2xl hover:cursor-pointer`}
                                    >
                                      {item.size}
                                    </p>
                                  ))}
                                </p>
                                <p className="flex text-[var(--mainColor)]">
                                  <p className="mr-1">د.ل</p>
                                  <p>
                                    {userr === "زبون عادي"
                                      ? product.price3
                                      : product.price2}
                                  </p>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="p-4">لا يوجد منتجات</p>
                  )}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  const GetProducts = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; products: any } };
      response = await axios.get("http://localhost:5000/products/getProducts", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setAllProduts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    if (produts) {
      setProdutss(produts);
      setNewProducts2(produts);
    }
  }, [produts]);

  useEffect(() => {
    if (allProduts) {
      setAllProduts2(allProduts.flatMap((item) => [item, ...item.products]));
    }
  }, [allProduts]);

  return (
    <>
      <p
        onClick={onOpen}
        className="bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)] p-4 rounded-full text-warning-800 hover:cursor-pointer mb-1"
      >
        {Icons.PencilIcon}
      </p>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className=" max-h-screen overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-500 scrollbar-track-gray-300 fixed z-50"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ! تعديل طلبية
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
                  تعديل الطلبية
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
