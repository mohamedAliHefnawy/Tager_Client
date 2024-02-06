//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

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
  Avatar,
  AccordionItem,
  Accordion,
  Spinner,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";
import { ShoppingbagIcon } from "@/public/svg/shoppingbagIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";

interface Supplier {
  _id: string;
  image: string;
  name: string;
  phone: string;
  products: string;
  active: boolean;
}

interface Row {
  _id: string;
  cost: string;
  image: string;
  price1: string;
  catogry: string | undefined;
  name: string;
  marketer: string;
  regularCustomer: string;
  color: string;
  total: number;
  size: [{ size: string }];
  images: string[];
  dynamicInputs: string[];
}

interface Product {
  _id: string;
  name: string;
  size: [{ size: string }];
  color: string;
  name1Product: string;
  price1: string;
  price2: string;
  price3: string;
  gbs: string;
  total: number;
  image: string[];
  products: Row[];
  active: boolean;
  catogry: string | undefined;
}

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}



export default function ModaelAddPurchase({
  supplier,
}: {
  supplier: Supplier[];
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Product[]>([]);
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);

  const [productsMoved, setProductsMoved] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [closeBtn, setCloseBtn] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = React.useState(
    new Set(["إختر المورد  "])
  );
  const [selectedPayment, setSelectedPayment] = React.useState(
    new Set(["إختر طريقة الدفع "])
  );
  const [inputValues, setInputValues] = useState<{
    [productId: string]: {
      _id: string;
      name: string;
      price: string;
      store: string;
      total: number;
      quantity: string;
      inputForStore: string;
      selectedStore: string[];
      selectedSize: string[];
    };
  }>({});

  const ItemsPerPage = 6;

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    DeleteIcon: <DeleteIcon />,
    ShoppingbagIcon: <ShoppingbagIcon />,
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const selectedValueSupplier = React.useMemo(
    () => Array.from(selectedSupplier).join(", ").replaceAll("_", " "),
    [selectedSupplier]
  );

  const handleSelectionChange1 = (selectedItems: string[]) => {
    setSelectedSupplier(new Set(selectedItems));
  };

  const handleSelectionChange2 = (selectedItems: string[]) => {
    setSelectedPayment(new Set(selectedItems));
  };

  const selectedValuePayment = React.useMemo(
    () => Array.from(selectedPayment).join(", ").replaceAll("_", " "),
    [selectedPayment]
  );

  const totalPages = Math.ceil((products?.length || 0) / ItemsPerPage);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (product.name &&
        product.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (product.catogry &&
        product.catogry.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleMoveProduct = (productId: string) => {
    const productToDelete = products.find(
      (product) => product._id === productId
    );
    if (productToDelete) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      setProductsMoved((prevMovedProducts) => [
        ...prevMovedProducts,
        productToDelete,
      ]);
    }
  };

  const handleMoveProduct2 = (productId: string) => {
    const productToDelete = productsMoved.find(
      (product) => product._id === productId
    );
    if (productToDelete) {
      setProductsMoved((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      setProducts((prevMovedProducts) => [
        ...prevMovedProducts,
        productToDelete,
      ]);
    }
  };

  const handleInputChange = (
    productId: string,
    field: string,
    value: string
  ) => {
    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [productId]: {
          ...prevValues[productId],
          [field]: value,
        },
      };

      newValues[productId].total = 0;
      return newValues;
    });
  };

  const handleSizeSelection = (
    productId: string,
    selectedKeys: Set<string>
  ) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [productId]: {
        ...prevValues[productId],
        selectedSize: Array.from(selectedKeys),
      },
    }));
  };
  const handleStoreSelection = (productId: any, selectedKeys: any) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [productId]: {
        ...prevValues[productId],
        selectedStore: Array.from(selectedKeys),
      },
    }));
  };

  useEffect(() => {
    const calculateTotal = () => {
      let total = 10;
      for (const productId in inputValues) {
        if (
          inputValues.hasOwnProperty(productId) &&
          inputValues[productId]?.total
        ) {
          total += inputValues[productId]?.total;
        }
      }
      return total;
    };

    const newTotalAmount = calculateTotal();
    setTotalAmount(newTotalAmount);
  }, [inputValues]);

  const Body = () => {
    return (
      <>
        <div className="flex justify-between h-screen">
          <div className="w-[50%] h-screen mr-2 border-1 border-orange-100 rounded-3xl p-10 pt-4 flex flex-col items-center">
            <input
              onChange={handleSearchChange}
              value={searchText}
              type="text"
              className="input"
              placeholder="قم بالبحث ..."
            />
            <div className="w-[100%] rounded-3xl mt-4 p-4">
              <div className="gap-2 grid grid-cols-2">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px] ">
                    <Spinner size="lg" color="warning" />
                  </div>
                ) : (
                  currentItems.map((product) => (
                    <>
                      <div key={product._id}>
                        <div className=" w-[100%] border-1 border-[var(--mainColor)]   p-3 rounded-3xl">
                          <div className="w-[100%] flex  justify-end">
                            <p className="mr-4"> {product.name} </p>
                            <Avatar src={product.image[0]} />
                          </div>

                          <div className="w-[100%] flex justify-end">
                            <p className="flex">
                              <p className="mr-2"> 0</p>
                              <p> | الكمية الموجودة </p>
                            </p>
                          </div>
                          <p
                            className="hover:cursor-pointer text-warning-600"
                            onClick={() => handleMoveProduct(product._id)}
                          >
                            {Icons.ShoppingbagIcon}
                          </p>

                          {product.products.length > 0 && (
                            <Accordion>
                              <AccordionItem>
                                {product.products.map((products2, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center mt-3 w-[100%]"
                                  >
                                    <div className="w-[20%]">
                                      <Avatar src={products2.image} />
                                    </div>
                                    <div className="w-[50%] text-center">
                                      <p>{products2.name}</p>
                                    </div>

                                    <div className="w-[20%]  ">
                                      <p className="flex justify-center">
                                        <p className="mr-1"> منتج</p>
                                        <p> 0</p>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </AccordionItem>
                            </Accordion>
                          )}
                        </div>
                      </div>
                    </>
                  ))
                )}
              </div>

              <div className="flex justify-start mt-4">
                <Pagination
                  showShadow
                  color="primary"
                  total={totalPages}
                  initialPage={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
          <div className=" w-[50%] max-h-screen overflow-y-auto  border-1 border-orange-100 rounded-3xl p-10">
            <Button
              color="warning"
              variant="bordered"
              className="w-[100%] mb-4"
              onClick={AddPurchases}
            >
              شراء
            </Button>
            <div className="gap-1 grid grid-cols-2">
              {productsMoved.map((movedProduct) => (
                <div key={movedProduct._id}>
                  <div className=" w-[100%] border-1 border-[var(--mainColor)]  p-3 rounded-3xl">
                    <div className="w-[100%] flex items-center justify-between">
                      <div>
                        <p
                          className="hover:cursor-pointer text-danger-600"
                          onClick={() => handleMoveProduct2(movedProduct._id)}
                        >
                          {Icons.DeleteIcon}
                        </p>
                      </div>
                      <div className="flex items-center justify-end">
                        <p className="mr-4"> {movedProduct.name} </p>
                        <Avatar src={movedProduct.image[0]} />
                      </div>
                    </div>

                    <div className="w-[100%] flex justify-between mt-6">
                      <div className="w-[100%] mr-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className="inputTrue">
                              {inputValues[movedProduct._id]?.selectedStore &&
                              inputValues[movedProduct._id]?.selectedStore
                                .length > 0
                                ? inputValues[
                                    movedProduct._id
                                  ]?.selectedStore.join(", ")
                                : inputValues[movedProduct._id]?.selectedStore
                                ? "المخزن"
                                : "المخزن"}
                            </Button>
                          </DropdownTrigger>

                          <DropdownMenu
                            variant="flat"
                            closeOnSelect={false}
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={
                              inputValues[movedProduct._id]?.selectedStore ||
                              new Set()
                            }
                            onSelectionChange={(selectedKeys) =>
                              handleStoreSelection(
                                movedProduct._id,
                                selectedKeys
                              )
                            }
                          >
                            {stores.map((item) => (
                              <DropdownItem key={item.gbs}>
                                {item.gbs}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        <div className="flex flex-col mt-1 w-[100%]">
                          {inputValues[movedProduct._id]?.selectedStore &&
                            inputValues[movedProduct._id]?.selectedStore.map(
                              (selectedStore: any) => (
                                <div
                                  key={selectedStore}
                                  className="ml-4 w-[100%]"
                                >
                                  <p className="p-3 flex w-[100%] items-center">
                                    <p className="mr-2 ">{selectedStore}</p>
                                    <div className=" w-[100%]">
                                      <input
                                        type="text"
                                        placeholder="الكمية"
                                        defaultValue={
                                          inputValues[movedProduct._id]
                                            ?.inputForStore &&
                                          inputValues[movedProduct._id]
                                            ?.inputForStore[selectedStore]
                                            ? inputValues[movedProduct._id]
                                                ?.inputForStore[selectedStore]
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleInputChange(
                                            movedProduct._id,
                                            selectedStore,
                                            e.target.value
                                          )
                                        }
                                        className="inputTrue"
                                      />
                                    </div>
                                  </p>
                                </div>
                              )
                            )}
                        </div>
                      </div>

                      <div className="w-24">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button className="inputTrue">
                              {inputValues[movedProduct._id]?.selectedSize &&
                              inputValues[movedProduct._id]?.selectedSize
                                .length > 0
                                ? inputValues[
                                    movedProduct._id
                                  ]?.selectedSize.join(", ")
                                : inputValues[movedProduct._id]?.selectedSize
                                ? "اختر"
                                : "اختر"}
                            </Button>
                          </DropdownTrigger>

                          <DropdownMenu
                            variant="flat"
                            closeOnSelect={false}
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={
                              inputValues[movedProduct._id]?.selectedSize ||
                              new Set()
                            }
                            onSelectionChange={(selectedKeys: any) =>
                              handleSizeSelection(
                                movedProduct._id,
                                selectedKeys
                              )
                            }
                          >
                            {movedProduct.size.map((item) => (
                              <DropdownItem key={item.size}>
                                {item.size}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>

                    {movedProduct.products.length > 0 && (
                      <Accordion>
                        <AccordionItem>
                          {movedProduct.products.map((products2, index) => (
                            <div key={index} className="">
                              <div className="flex items-center justify-end ">
                                <Avatar src={products2.image[0]} />
                              </div>

                              <div className="w-[100%] flex justify-between mt-6">
                                <div className="w-[100%] mr-2">
                                  <Dropdown>
                                    <DropdownTrigger>
                                      <Button className="inputTrue">
                                        {inputValues[products2._id]
                                          ?.selectedStore &&
                                        inputValues[products2._id]
                                          ?.selectedStore.length > 0
                                          ? inputValues[
                                              products2._id
                                            ]?.selectedStore.join(", ")
                                          : inputValues[products2._id]
                                              ?.selectedStore
                                          ? "المخزن"
                                          : "المخزن"}
                                      </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu
                                      variant="flat"
                                      closeOnSelect={false}
                                      disallowEmptySelection
                                      selectionMode="multiple"
                                      selectedKeys={
                                        inputValues[products2._id]
                                          ?.selectedStore || new Set()
                                      }
                                      onSelectionChange={(selectedKeys) =>
                                        handleStoreSelection(
                                          products2._id,
                                          selectedKeys
                                        )
                                      }
                                    >
                                      {stores.map((item) => (
                                        <DropdownItem key={item.gbs}>
                                          {item.gbs}
                                        </DropdownItem>
                                      ))}
                                    </DropdownMenu>
                                  </Dropdown>

                                  <div className="flex flex-col mt-1 w-[100%]">
                                    {inputValues[products2._id]
                                      ?.selectedStore &&
                                      inputValues[
                                        products2._id
                                      ]?.selectedStore.map(
                                        (selectedStore: any) => (
                                          <div
                                            key={selectedStore}
                                            className="ml-4 w-[100%]"
                                          >
                                            <p className="p-3 flex w-[100%] items-center">
                                              <p className="mr-2 ">
                                                {selectedStore}
                                              </p>
                                              <div className=" w-[100%]">
                                                <input
                                                  type="text"
                                                  placeholder="الكمية"
                                                  defaultValue={
                                                    inputValues[products2._id]
                                                      ?.inputForStore &&
                                                    inputValues[products2._id]
                                                      ?.inputForStore[
                                                      selectedStore
                                                    ]
                                                      ? inputValues[
                                                          products2._id
                                                        ]?.inputForStore[
                                                          selectedStore
                                                        ]
                                                      : ""
                                                  }
                                                  onChange={(e) =>
                                                    handleInputChange(
                                                      products2._id,
                                                      selectedStore,
                                                      e.target.value
                                                    )
                                                  }
                                                  className="inputTrue"
                                                />
                                              </div>
                                            </p>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>

                                <div className="w-24">
                                  <Dropdown>
                                    <DropdownTrigger>
                                      <Button className="inputTrue">
                                        {inputValues[products2._id]
                                          ?.selectedSize &&
                                        inputValues[products2._id]?.selectedSize
                                          .length > 0
                                          ? inputValues[
                                              products2._id
                                            ]?.selectedSize.join(", ")
                                          : inputValues[products2._id]
                                              ?.selectedSize
                                          ? "اختر"
                                          : "اختر"}
                                      </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu
                                      variant="flat"
                                      closeOnSelect={false}
                                      disallowEmptySelection
                                      selectionMode="multiple"
                                      selectedKeys={
                                        inputValues[products2._id]
                                          ?.selectedSize || new Set()
                                      }
                                      onSelectionChange={(selectedKeys: any) =>
                                        handleSizeSelection(
                                          products2._id,
                                          selectedKeys
                                        )
                                      }
                                    >
                                      {products2.size.map((item) => (
                                        <DropdownItem key={item.size}>
                                          {item.size}
                                        </DropdownItem>
                                      ))}
                                    </DropdownMenu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-[100%] my-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="warning"
                    variant="bordered"
                    className="w-[100%]"
                  >
                    {selectedValueSupplier}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedSupplier}
                  onSelectionChange={(keys: string[] | any) =>
                    handleSelectionChange1(keys)
                  }
                >
                  {supplier.map((item) => (
                    <DropdownItem key={item.name}>{item.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="warning"
                    variant="bordered"
                    className="w-[100%] my-4"
                  >
                    {selectedValuePayment}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedPayment}
                  onSelectionChange={(keys: string[] | any) =>
                    handleSelectionChange2(keys)
                  }
                >
                  {moneySafe.map((item) => (
                    <DropdownItem key={item.name}>{item.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="w-[100%] h-[1px] my-4 bg-orange-300"></div>
            <div className="w-[100%] p-4 bg-orange-300 flex justify-center">
              <p className="flex">
                <p className="flex mr-2">
                  <p>د.ل</p>
                  <p>{totalAmount}</p>
                </p>
                <p style={{ direction: "rtl" }}>إجمالي المنتجات |</p>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const AddPurchases = async () => {
    setCloseBtn(true);
    try {
      const ProductsName = productsMoved;

      const data = {
        inputValues,
        ProductsName,
        supplier: selectedValueSupplier,
        moneySafe: selectedValuePayment,
        totalBuy: totalAmount,
      };
      const response = await axios.post(
        "https://tager-server.vercel.app/purchases/addPurchases",
        data
      );
      if (response.data === "yes") {
        toast.success("تم عمل الشراء بنجاح ✓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetProducts = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; products: any } };
      response = await axios.get("https://tager-server.vercel.app/products/getProducts", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setProducts(response.data.products);
     
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const GetStores = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; stores: any } };
      response = await axios.get("https://tager-server.vercel.app/stores/getStores", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setStores(response.data.stores);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const GetMoneySafe = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get("https://tager-server.vercel.app/payment/getpayment", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setMoneySafe(response.data.payment);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetProducts();
    GetMoneySafe();
    GetStores();
  }, []);

  return (
    <>
      <ToastContainer />
      <Button
        onPress={onOpen}
        color="warning"
        className="mt-5 h-14 opacity-90 rounded-full px-4"
        startContent={Icons.ShoppingbagIcon}
      >
        <p> تسوق </p>
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
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
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
