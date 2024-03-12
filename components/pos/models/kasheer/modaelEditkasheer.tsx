//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUnixTime } from "date-fns";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

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
  CardBody,
  Card,
  Tab,
  Tabs,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import Swal from "sweetalert2";

interface Stores {
  _id: string;
  name: string;
  gbs: string;
  priceDelivery: string;
}

interface MoneySafe {
  _id: string;
  name: string;
  money: [{ value: string; notes: string }];
  active: Boolean;
  image: string;
}

export default function ModelEditkasheer({
  idkasheer,
  namekasheer,
  imagekasheer,
  phonekasheer,
  passwordkasheer,
  storekasheer,
  moneyStorekasheer,
}: {
  idkasheer: string;
  namekasheer: string;
  imagekasheer: string;
  phonekasheer: string;
  passwordkasheer: string;
  storekasheer: string;
  moneyStorekasheer: string;
}) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageURL, setImageURL] = useState("");
  const [img, setImg] = useState(imagekasheer);
  const [name, setName] = useState(namekasheer);
  const [phone, setPhone] = useState(phonekasheer);
  const [password, setPassword] = useState(passwordkasheer);
  const [closeBtn, setCloseBtn] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [selected, setSelected] = React.useState("photos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState(storekasheer);
  const [selectedMoneySafe, setSelectedMoneySafe] = useState(moneyStorekasheer);
  const [stores, setStores] = useState<Stores[]>([]);
  const [moneySafe, setMoneySafe] = useState<MoneySafe[]>([]);
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSearchMoneySafe = (e: any) => {
    setSearchText2(e.target.value);
  };

  const filteredStore = stores.filter((store) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (store.name && store.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (store.gbs && store.gbs.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const filteredMoneySafe = moneySafe.filter((moneySafe) => {
    const lowerCaseSearchText = searchText2.toLowerCase();
    return (
      (moneySafe.name &&
        moneySafe.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (moneySafe.money &&
        moneySafe.money.some(
          (item) =>
            item.value.toLowerCase().includes(lowerCaseSearchText) ||
            item.notes.toLowerCase().includes(lowerCaseSearchText)
        )) ||
      (moneySafe.active &&
        moneySafe.active.toString().toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStore.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems2 = filteredMoneySafe.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const TabDataKasheer = () => {
    return (
      <Card>
        <CardBody>
          <form className="flex flex-col justify-center items-center">
            <div className="w-[100%] flex justify-center">
              <label
                htmlFor="img"
                className="p-0 rounded-full text-black hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
              >
                <Avatar size="lg" src={img} />
              </label>
              <input
                type="file"
                id="img"
                className="hidden"
                onChange={(e) => Upload(e.target.files)}
              />
            </div>
            <input
              type="text"
              className="input"
              placeholder="إسم الكاشير"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled
            />
            <input
              type="number"
              className="input"
              placeholder="رقم الهاتف "
              value={phone}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= 16) {
                  setPhone(inputValue);
                }
              }}
            />

            <input
              type="name"
              className="input"
              defaultValue={password}
              placeholder="كلمه المرور"
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </CardBody>
      </Card>
    );
  };

  const TabMoneyStore = () => {
    return (
      <Card>
        <CardBody>
          <div className="w-[100%]">
            <input
              type="text"
              placeholder=" بحث ..."
              className="w-[30%] input"
              onChange={handleSearchMoneySafe}
              value={searchText2}
            />
          </div>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : filteredMoneySafe.length === 0 ? (
              <p className="text-default-500 text-center w-[100%] p-6">
                لا توجد نتائج للبحث
              </p>
            ) : (
              currentItems2.map((moneySafe, indexMoneySafe) =>
                selectedMoneySafe === moneySafe.name ? (
                  <Card
                    shadow="sm"
                    key={indexMoneySafe}
                    className="hover:cursor-pointer border-1 border-primary-400"
                  >
                    <CardBody
                      className="overflow-visible p-6 flex flex-col items-end"
                      onClick={() => setSelectedMoneySafe(moneySafe.name)}
                    >
                      <p className="flex">
                        <span className="mr-2">{moneySafe.name}</span>
                        <span className="opacity-65"> :- الإسم </span>
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <Card
                    shadow="sm"
                    key={indexMoneySafe}
                    className="hover:cursor-pointer"
                  >
                    <CardBody
                      className="overflow-visible p-6 flex flex-col items-end"
                      onClick={() => setSelectedMoneySafe(moneySafe.name)}
                    >
                      <p className="flex">
                        <span className="mr-2">{moneySafe.name}</span>
                        <span className="opacity-65"> :- الإسم </span>
                      </p>
                    </CardBody>
                  </Card>
                )
              )
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  const TabStore = () => {
    return (
      <Card>
        <CardBody>
          <div className="w-[100%]">
            <input
              type="text"
              placeholder=" بحث ..."
              className="w-[30%] input"
              onChange={handleSearchChange}
              value={searchText}
            />
          </div>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner size="lg" />
              </div>
            ) : filteredStore.length === 0 ? (
              <p className="text-default-500 text-center w-[100%] p-6">
                لا توجد نتائج للبحث
              </p>
            ) : (
              currentItems.map((store, indexStore) =>
                selectedStore === store.name ? (
                  <Card
                    shadow="sm"
                    key={indexStore}
                    className="hover:cursor-pointer border-1 border-primary-400"
                  >
                    <CardBody
                      className="overflow-visible p-6 flex flex-col items-end"
                      onClick={() => setSelectedStore(store.name)}
                    >
                      <p className="flex">
                        <span className="mr-2">{store.name}</span>
                        <span className="opacity-65"> :- الإسم </span>
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <Card
                    shadow="sm"
                    key={indexStore}
                    className="hover:cursor-pointer"
                  >
                    <CardBody
                      className="overflow-visible p-6 flex flex-col items-end"
                      onClick={() => setSelectedStore(store.name)}
                    >
                      <p className="flex">
                        <span className="mr-2">{store.name}</span>
                        <span className="opacity-65"> :- الإسم </span>
                      </p>
                    </CardBody>
                  </Card>
                )
              )
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUploadImage = async (selectedFiles?: FileList | null) => {
    const file = selectedFiles?.[0];
    if (file) {
      const image = await imagebase64(file);
      setImg(image);
    }
  };

  const generateUniqueFileName = (file: File) => {
    const timestamp = getUnixTime(new Date());
    const randomChars = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}_${randomChars}_${file.name}`;
    return fileName;
  };

  const Upload = async (selectedFiles: FileList | null) => {
    handleUploadImage(selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileName = generateUniqueFileName(file);

      const fileRef = ref(analytics, `elhbaieb/${fileName}`);
      const data = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(data.ref);
      setImageURL(url);
    } else {
      alert("Please select a file");
    }
  };

  const tabs = () => {
    return (
      <>
        <div className="flex w-full flex-col">
          <Tabs
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="warning"
            style={{ direction: "rtl" }}
          >
            <Tab key="1" title="المعلومات الشخصية">
              {TabDataKasheer()}
            </Tab>
            <Tab key="2" title="طرق الدفع">
              {TabMoneyStore()}
            </Tab>
            <Tab key="3" title="المخزن">
              {TabStore()}
            </Tab>
          </Tabs>
        </div>
      </>
    );
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

  const GetMoneySafe = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; payment: any } };
      response = await axios.get(`${linkServer.link}payment/getpayment`, {
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
    GetStores();
    GetMoneySafe();
  }, []);

  const Editkasheer = async () => {
    try {
      const data = {
        id: idkasheer,
        name,
        imageURL,
        phone,
        password,
        selectedStore,
        selectedMoneySafe,
      };
      const response = await axios.post(
        `${linkServer.link}Kasheer/editkasheer`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تم تعديل حساب الكاشير بنجاح ",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });
        window.location.reload();
      }
      if (response.data === "no") {
        Swal.fire({
          icon: "error",
          title: "تم مشكله حاول مره أخري ",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
          position: "top-right",
          timer: 4000,
          timerProgressBar: true,
          toast: true,
          showConfirmButton: false,
        });
        window.location.reload();
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="ghost"
        className="rounded-full mb-2 mt-2 "
        color="warning"
        startContent={Icons.PencilIcon}
      ></Button>
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
                تعديل الكاشير
              </ModalHeader>
              <ModalBody>{tabs()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button color="warning" onClick={Editkasheer}>
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
