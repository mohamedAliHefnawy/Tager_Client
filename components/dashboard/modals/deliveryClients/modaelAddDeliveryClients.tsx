//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { getUnixTime } from "date-fns";

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
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Avatar,
} from "@nextui-org/react";

//fireBase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//compenents
import { analytics } from "@/fireBase/fireBaseConfig";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";

export default function ModelAddDeliveryClients(props: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageURL, setImageURL] = useState("");
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [password, setPassword] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [selected, setSelected] = React.useState("1");
  const [selectedValidity, setSelectedValidity] = React.useState(
    new Set(["مندوب توصيل"])
  );

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const selectedValue = React.useMemo(
    () => Array.from(selectedValidity).join(", ").replaceAll("_", " "),
    [selectedValidity]
  );

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
  };

  function generateStrongPassword() {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  const generatePassword = () => {
    const newPassword = generateStrongPassword();
    setGeneratedPassword(newPassword);
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
      console.log(url);
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
              <Card>
                <CardBody>
                  <form className="flex flex-col justify-center items-center">
                    <div className="w-[100%] flex justify-center">
                      {!img ? (
                        <label
                          htmlFor="img"
                          className="p-10 rounded-full text-black hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
                        >
                          {Icons.PhotoIcon}
                        </label>
                      ) : (
                        <label
                          htmlFor="img"
                          className="p-0 rounded-full text-black hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
                        >
                          <Avatar size="lg" src={imageURL} />
                        </label>
                      )}
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
                      placeholder="إسم الموظف"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
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
            </Tab>

            <Tab key="3" title="الصلاحيات">
              <Card>
                <CardBody>
                  {/* <Dropdown>
                    <DropdownTrigger>
                      <Button
                        color="warning"
                        variant="bordered"
                        // className="w-[100%] mt-4 border-1 border-primary-300 rounded-xl"
                      >
                        {selectedValue}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedValue}
                      onSelectionChange={(keys) =>
                        setSelectedValidity(keys as Set<string>)
                      }
                    >
                      <DropdownItem key="مندوب توصيل">مندوب توصيل</DropdownItem>
                     
                    </DropdownMenu>
                  </Dropdown> */}
                  <Button
                    color="warning"
                    variant="bordered"
                  >
                    {selectedValue}
                  </Button>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  const AddEmployee = async () => {
    try {
      const data = { name, phone, imageURL, password, selectedValue };
      const response = await axios.post(
        "http://localhost:5000/users/addemployee",
        data
      );
      if (response.data === "yes") {
        alert("تم إضافة الموظف بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("هذا الموظف موجود بالفعل 😊");
        // window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      name.trim() !== "" &&
      phone.trim() !== "" &&
      password !== "" &&
      imageURL !== ""
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [name, phone, password, imageURL]);

  return (
    <>
      <Button
        onPress={onOpen}
        color="warning"
        className="h-14 mt-4"
        startContent={Icons.PlusIcon}
      >
        إضافة مندوب توصيل
      </Button>
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
                {props.titleButton}
              </ModalHeader>
              <ModalBody>{tabs()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  onClick={AddEmployee}
                  disabled={closeBtn}
                >
                  إضافة
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
