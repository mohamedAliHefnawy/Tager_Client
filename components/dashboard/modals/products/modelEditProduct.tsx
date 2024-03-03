//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { getUnixTime } from "date-fns";
import { TwitterPicker } from "react-color";
import linkServer from "@/linkServer";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents
import { analytics } from "@/fireBase/fireBaseConfig";

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
  Tabs,
  Card,
  Tab,
  CardBody,
} from "@nextui-org/react";

//primerRact

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { DeleteIcon } from "../../../../public/svg/deleteIcon";
import { PencilIcon } from "../../../../public/svg/pencilIcon";

interface Categories {
  _id: string;
  image: string[];
  name: string;
  products: string;
  active: boolean;
  catogry: string;
}

interface Stores {
  _id: string;
  name: string;
  gbs: string;
}

interface Row {
  id: string;
  cost: string;
  image: string;
  price1?: string; // Make it optional
  price2: string; // Add price2 property
  price3: string; // Add price3 property
  catogry: string | undefined;
  name: string;
  marketer: string;
  gainMarketer: string;
  regularCustomer: string;
  color: string;
  size: [{ size: string; store: [{ amount: number }] }];
  images: string[];
  dynamicInputs: string[];
}

interface Product {
  _id: string;
  name: string;
  size: [{ size: string; store: [{ amount: number }] }];
  color: string;
  name1Product: string;
  price1: string;
  price2: string;
  price3: string;
  image: string[];
  products: Row[];
  active: boolean;
  catogry: string | undefined;
}

interface SizeObject {
  size: string;
  // Add other properties if needed
}

interface ModelAddProductProps {
  nameProductt: string;
  setNameProductt: React.Dispatch<React.SetStateAction<string>>;
  imageURLL: string;
  setImageURLL: React.Dispatch<React.SetStateAction<string>>;
  onAddProductt: (newProduct: Product) => void;
}

export default function ModelEditProduct({
  idProductt,
  nameProductt,
  nameCategoryy,
  imagesProductt,
  price1Productt,
  price2Productt,
  price3Productt,
  price4Productt,
  colorProductt,
  sizeProductt,
  allProductt,
}: {
  idProductt: string;
  nameProductt: string;
  nameCategoryy: string | undefined;
  imagesProductt: string[];
  price1Productt: string;
  price2Productt: string;
  price3Productt: string;
  price4Productt: string;
  colorProductt: string;
  sizeProductt: [{ size: string; store: [{ amount: number }] }];
  allProductt: Row[];
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nameProduct, setNameProduct] = useState("");
  const [priceProduct1, setPriceProduct1] = useState("");
  const [priceProduct2, setPriceProduct2] = useState("");
  const [priceProduct3, setPriceProduct3] = useState("");
  const [priceProduct4, setPriceProduct4] = useState("");
  const [sizeProduct, setSizeProduct] = useState<SizeObject[]>([]);
  const [closeBtn, setCloseBtn] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [imageURLs2, setImageURLs2] = useState<string[]>([]);
  const [showDivCatogry, setShowDivCatogry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [stores, setStores] = useState<Stores[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(
    nameCategoryy
      ? {
          _id: "",
          image: [],
          name: nameCategoryy || "",
          products: "",
          active: false,
          catogry: "",
        }
      : null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermStore, setSearchTermStore] = useState("");
  const [colorProductMain, setColorProductMain] = useState("");
  const handleChangeProductMain = (newColor: any) => {
    setColorProductMain(newColor.hex);
  };
  const [rows, setRows] = useState<Row[]>([]);

  const addNewRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: "",
        cost: "",
        marketer: "",
        gainMarketer: "",
        regularCustomer: "",
        color: "#ffffff",
        images: [],
        dynamicInputs: [],
        image: "",
        price1: "",
        price2: "",
        price3: "",
        catogry: "",
        name: "",
        size: [{ size: "", store: [{ amount: 0 }] }],
      },
    ]);
  };

  const handleDynamicInputChange = (
    rowIndex: number,
    inputIndex: number,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].dynamicInputs[inputIndex] = value;
    setRows(newRows);
  };

  const handleDeleteInputSize = (rowIndex: number, inputIndex: number) => {
    setRows((prevRows) => {
      return prevRows.map((row, currentRowIndex) => {
        if (currentRowIndex === rowIndex) {
          const newInputs: string[] = row.dynamicInputs.filter(
            (_, index) => index !== inputIndex
          );
          return { ...row, dynamicInputs: newInputs };
        }
        return row;
      });
    });
  };

  const addDynamicInput = (rowIndex: number) => {
    const newRows = [...rows];
    newRows[rowIndex].dynamicInputs.push("");
    setRows(newRows);
  };

  // const handleSizeChange = (index: number, value: string) => {
  //   const newSizes = [...sizeProduct];
  //   newSizes[index] = value;
  //   setSizeProduct(newSizes);
  // };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizeProduct];
    newSizes.splice(index, 1);
    setSizeProduct(newSizes);
  };

  const handleAddSize = () => {
    setSizeProduct([...sizeProduct, { size: "" }]);
  };

  const handleChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    if (field === "images") {
      newRows[index][field] = [value] as unknown as Row["images"];
    } else {
      newRows[index][field] = value as any;
    }
    setRows(newRows);
  };

  const handleDeleteRow = (index: any) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChangeColor = ({ index, color }: any) => {
    if (color && color.hex) {
      const newRows = [...rows];
      newRows[index]["color"] = color.hex;
      setRows(newRows);
    } else {
      console.error("Invalid color object:", color);
    }
  };

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    DeleteIcon: <DeleteIcon />,
    PencilIcon: <PencilIcon />,
  };

  const generateUniqueFileName = (file: File) => {
    const timestamp = getUnixTime(new Date());
    const randomChars = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}_${randomChars}_${file.name}`;
    return fileName;
  };

  const generateUniqueFileName2 = (file: File) => {
    const timestamp = getUnixTime(new Date());
    const randomChars = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}_${randomChars}_${file.name}`;
    return fileName;
  };

  const handleFileSelection = async (files: FileList | null) => {
    if (!files) return;
    const filesArray = Array.from(files) as File[];
    setSelectedFiles(filesArray);

    const urls = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const fileName = generateUniqueFileName(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      urls.push(url);
    }

    setImageURLs(urls);
  };

  const handleFileSelection2 = async (index: any, files: FileList | null) => {
    if (!files) return;
    const filesArray = Array.from(files) as File[];

    const urls: string[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const fileName = generateUniqueFileName2(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      urls.push(url);
    }
    const newRows: Row[] = [...rows];
    newRows.forEach((row, rowIndex) => {
      if (rowIndex === index) {
        row.images = urls as string[];
      }
    });
    setRows(newRows);
    setImageURLs2(urls);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTermStore.toLowerCase())
  );

  const handleCategorySelect = (store: any) => {
    setSelectedCategory(store);
    setShowDivCatogry(false);
  };

  const Tabss = () => {
    return (
      <>
        <Tabs
          aria-label="Options"
          className=" flex justify-start"
          color="warning"
          style={{ direction: "rtl" }}
        >
          <Tab key="1" title="المنتج الرئيسي">
            <Card>
              <CardBody>
                <div className="p-4 flex flex-col items-center">
                  <div className="w-[100%] items-center">
                    <div className="w-[100%] flex justify-center">
                      <input
                        type="text"
                        id="img"
                        className="input"
                        placeholder="إسم المنتج"
                        value={nameProduct}
                        onChange={(e) => setNameProduct(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="w-[100%] flex justify-center items-center mt-5">
                    <input
                      type="file"
                      id="img"
                      className=""
                      // value={imageURLs}
                      onChange={(e) => handleFileSelection(e.target.files)}
                      multiple
                    />
                    {/* {imagesProductt} */}

                    {selectedFiles && selectedFiles.length > 0 ? (
                      <div className="flex justify-center">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="mr-2">
                            <label
                              htmlFor="img"
                              className="p-0 rounded-full text-black hover:cursor-pointer"
                            >
                              <Avatar
                                size="lg"
                                src={URL.createObjectURL(file)}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      imagesProductt.map((file, index) => (
                        <div key={index} className="mr-2">
                          <label
                            htmlFor="img"
                            className="p-0 rounded-full text-black hover:cursor-pointer"
                          >
                            <Avatar size="lg" src={file} />
                          </label>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="w-[100%] ">
                    <Button
                      className="input opacity-70"
                      variant="bordered"
                      onClick={() => setShowDivCatogry(!showDivCatogry)}
                    >
                      {selectedCategory ? selectedCategory.name : nameCategoryy}
                    </Button>
                    <div
                      className={`w-[100%] border-2 rounded-lg mt-3 flex flex-col items-center transition-all duration-500 ${
                        showDivCatogry
                          ? "opacity-100 translate-y-0"
                          : "hidden translate-y-full"
                      }`}
                    >
                      <div className="w-[100%] p-6 pt-0 flex flex-col items-center">
                        <input
                          type="text"
                          className="input opacity-40"
                          placeholder="بحث ..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredCategories.map((category, index) => (
                          <div
                            key={index}
                            className="my-2"
                            onClick={() => handleCategorySelect(category)}
                          >
                            <p className="hover:cursor-pointer">
                              {category.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] flex items-center">
                    <input
                      type="number"
                      className="input mr-1"
                      placeholder="سعر  التكلفة"
                      value={priceProduct1}
                      onChange={(e) =>
                        setPriceProduct1(e.target.value.toString())
                      }
                    />
                    <div className="w-[100%]">
                      <input
                        type="number"
                        className="input"
                        placeholder="سعر البيع للمسوق"
                        value={priceProduct2}
                        onChange={(e) =>
                          setPriceProduct2(e.target.value.toString())
                        }
                      />
                      <input
                        type="number"
                        className="input"
                        placeholder="ربح المسوق"
                        value={priceProduct4}
                        onChange={(e) =>
                          setPriceProduct4(e.target.value.toString())
                        }
                      />
                    </div>
                    <input
                      type="text"
                      className="input ml-1"
                      placeholder="سعر البيع للزبون العادي"
                      value={priceProduct3}
                      onChange={(e) =>
                        setPriceProduct3(e.target.value.toString())
                      }
                    />
                  </div>
                  <div className="w-[100%] flex items-center my-4 p-6">
                    <div
                      style={{ backgroundColor: `${colorProductMain}` }}
                      className="w-[50%] p-8"
                    >
                      <TwitterPicker
                        color={colorProductMain}
                        onChangeComplete={handleChangeProductMain}
                      />
                    </div>
                    <div className="w-[50%]">
                      {sizeProduct.map((sizeObj, index) => (
                        <div key={index} className="mb-2 flex items-center">
                          <input
                            type="text"
                            className="input ml-1"
                            placeholder="المقاس"
                            value={sizeObj.size}
                            onChange={(e) => {
                              const updatedSizes = sizeProduct.map((item, i) =>
                                i === index
                                  ? { ...item, size: e.target.value }
                                  : item
                              );
                              setSizeProduct(updatedSizes);
                            }}
                          />
                          <p
                            className="text-danger-600 opacity-50 mt-2 hover:cursor-pointer"
                            onClick={() => handleRemoveSize(index)}
                          >
                            {Icons.DeleteIcon}
                          </p>
                        </div>
                      ))}

                      {/* {sizeProductt.map((item) => item.size)} */}
                      <Button onClick={handleAddSize}>إضافة مقاس</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="2" title="المنتجات الفرعية">
            <Card>
              <CardBody>
                <Button
                  color="warning"
                  variant="bordered"
                  className="mb-3"
                  onClick={addNewRow}
                >
                  إضافة منتج
                </Button>
                {/* {allProductt.map((item) => item.color)} */}
                <table className="border-1 border-warning-400 w-full rounded-2xl text-center p-4">
                  <tr className="border-1 border-warning-400 rounded-2xl text-sm">
                    <th className="border-1 w-[20%] border-warning-400 p-3">
                      السعر
                    </th>
                    <th className="border-1 w-[10%] border-warning-400 p-3">
                      اللون
                    </th>
                    <th className="border-1 w-[20%] border-warning-400">
                      المقاس
                    </th>
                    <th className="border-1 w-[20%] border-warning-400">
                      الصور
                    </th>
                  </tr>

                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className="border-1 border-warning-400 rounded-2xl text-sm"
                    >
                      <td className="border-1 w-[20%] border-warning-400 p-3">
                        <div className="w-[100%]">
                          <input
                            type="number"
                            value={row.cost}
                            onChange={(e) =>
                              handleChange(index, "cost", e.target.value)
                            }
                            className="inputTrue mt-2"
                            placeholder="التكلفة"
                          />
                          <input
                            type="number"
                            value={row.marketer}
                            onChange={(e) =>
                              handleChange(index, "marketer", e.target.value)
                            }
                            className="inputTrue mt-2"
                            placeholder="لمندوب التسويق"
                          />
                          <input
                            type="number"
                            value={row.gainMarketer}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "gainMarketer",
                                e.target.value
                              )
                            }
                            className="inputTrue mt-2"
                            placeholder="ربح مندوب التسويق"
                          />
                          <input
                            type="text"
                            value={row.regularCustomer}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "regularCustomer",
                                e.target.value
                              )
                            }
                            className="inputTrue mt-2"
                            placeholder="للزبون العادي"
                          />
                        </div>
                      </td>
                      <td
                        style={{ backgroundColor: row.color }}
                        className="border-1 w-[20%] border-warning-400 p-3"
                      >
                        <div className=" w-[60%]">
                          <TwitterPicker
                            color={row.color}
                            onChangeComplete={(color) =>
                              handleChangeColor({ index, color })
                            }
                          />
                        </div>
                      </td>
                      <td className="border-1 w-[20%] border-warning-400">
                        <div className="w-[100%] px-3 flex flex-col items-start">
                          {row.dynamicInputs.map((input, inputIndex) => (
                            <div key={inputIndex}>
                              <input
                                type="text"
                                value={input}
                                onChange={(e) =>
                                  handleDynamicInputChange(
                                    index,
                                    inputIndex,
                                    e.target.value
                                  )
                                }
                                className="inputTrue mt-2"
                                placeholder={`المقاس ${inputIndex + 1}`}
                              />
                              <p
                                className="text-danger-600 opacity-50 mt-2 hover:cursor-pointer"
                                onClick={() =>
                                  handleDeleteInputSize(index, inputIndex)
                                }
                              >
                                {Icons.DeleteIcon}
                              </p>
                            </div>
                          ))}

                          <Button
                            className="mt-2 w-[100%]"
                            onClick={() => addDynamicInput(index)}
                          >
                            إضافة مقاس
                          </Button>
                        </div>
                      </td>

                      <td>
                        <div className="w-[100%] flex flex-col items-center">
                          <input
                            type="file"
                            id={`img-${index}`}
                            className="ml-3"
                            onChange={(e) =>
                              handleFileSelection2(index, e.target.files)
                            }
                            multiple
                          />
                        </div>
                        <div className="flex justify-center mt-2">
                          {row.images &&
                            row.images.length > 0 &&
                            row.images.map((url, fileIndex) => (
                              <div key={fileIndex} className="mr-2">
                                <Image
                                  src={url}
                                  alt={`الصورة المحددة ${fileIndex + 1}`}
                                  width={64} // Set your preferred width
                                  height={64} // Set your preferred height
                                  className="w-16 h-16 object-cover rounded-full"
                                />
                              </div>
                            ))}
                        </div>
                        <p
                          className="absolute right-0 text-danger-600 hover:cursor-pointer"
                          onClick={() => handleDeleteRow(index)}
                        >
                          {Icons.DeleteIcon}
                        </p>
                      </td>
                    </tr>
                  ))}
                </table>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </>
    );
  };

  const GetCategories = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; categories: any } };
      response = await axios.get(`${linkServer.link}categories/getCategories`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setCategories(response.data.categories);
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
      response = await axios.get(`${linkServer.link}stores/getStores`, {
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

  const EditProduct = async () => {
    try {
      const data = {
        idProductt,
        nameProduct,
        imageURLs,
        selectedCategory: selectedCategory?.name || selectedCategory,
        priceProduct1,
        priceProduct2,
        priceProduct3,
        priceProduct4,
        colorProductMain,
        sizeProduct,
        rows,
      };
      const response = await axios.post(
        `${linkServer.link}products/editProduct`,
        data
      );
      if (response.data === "yes") {
        toast.success("تم تعديل المنتج بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "nameUse") {
        Swal.fire({
          icon: "warning",
          title: "هذا الإسم مستخدم من قبل ",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetCategories();
    GetStores();
  }, []);

  useEffect(() => {
    if (
      sizeProductt &&
      nameCategoryy &&
      nameProductt &&
      colorProductt &&
      price4Productt
    ) {
      const convertedSizeProduct: SizeObject[] = sizeProductt.map(
        (sizeObject) => ({
          size: sizeObject.size,
        })
      );

      setSizeProduct(convertedSizeProduct);
      setColorProductMain(colorProductt);
      setNameProduct(nameProductt);
      setPriceProduct1(price1Productt);
      setPriceProduct2(price2Productt);
      setPriceProduct3(price3Productt);
      setPriceProduct4(price4Productt);
      setImageURLs(imagesProductt);
      setSelectedCategory({
        name: nameCategoryy,
        _id: "",
        image: [],
        products: "",
        active: false,
        catogry: "",
      });
    }
  }, [
    sizeProductt,
    nameCategoryy,
    nameProductt,
    colorProductt,
    price4Productt,
    imagesProductt,
    price1Productt,
    price2Productt,
    price3Productt,
  ]);

  useEffect(() => {
    if (allProductt) {
      setRows(
        allProductt.map((product) => ({
          id: "",
          cost: product.price1 || "",
          marketer: product.price2,
          gainMarketer: product.gainMarketer,
          regularCustomer: product.price3,
          color: product.color,
          images: [product.image],
          dynamicInputs: product.size.map((item) => item.size),
          image: "",
          price1: "",
          price2: "",
          price3: "",
          catogry: "",
          name: "",
          size: product.size,
        }))
      );
    }
  }, [allProductt]);

  // useEffect(() => {
  //   if (
  //     nameProduct !== "" &&
  //     selectedCategory !== undefined &&
  //     priceProduct1 !== "" &&
  //     priceProduct2 !== "" &&
  //     priceProduct3 !== ""
  //   ) {
  //     setCloseBtn(false);
  //   } else {
  //     setCloseBtn(true);
  //   }
  // }, [
  //   nameProduct,
  //   selectedCategory,
  //   priceProduct1,
  //   priceProduct2,
  //   priceProduct3,
  // ]);

  return (
    <>
      <ToastContainer />
      <p
        onClick={onOpen}
        className="hover:cursor-pointer hover:opacity-75 bg-warning-200 p-3 mb-1 rounded-full border-1 border-warning-600 text-warning-800"
      >
        {Icons.PencilIcon}
      </p>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        className="max-h-[500px] overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تعديل ({nameProductt})
              </ModalHeader>
              <ModalBody>{Tabss()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  // color={closeBtn ? "default" : "warning"}
                  onClick={EditProduct}
                  // disabled={closeBtn}
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
