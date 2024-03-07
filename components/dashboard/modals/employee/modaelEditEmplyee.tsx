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
} from "@nextui-org/react";

export default function ModelEditEmplyee({
  idEmployee,
  nameEmployee,
  imageEmployee,
  phoneEmployee,
  passwordEmployee,
  validitiyEmployee,
}: {
  idEmployee: string;
  nameEmployee: string;
  imageEmployee: string;
  phoneEmployee: string;
  passwordEmployee: string;
  validitiyEmployee: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageURL, setImageURL] = useState("");
  const [img, setImg] = useState(imageEmployee);
  const [name, setName] = useState(nameEmployee);
  const [phone, setPhone] = useState(phoneEmployee);
  const [password, setPassword] = useState(passwordEmployee);
  const [closeBtn, setCloseBtn] = useState(true);
  const [selected, setSelected] = React.useState("photos");
  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };
  const [selectedValidity, setSelectedValidity] = React.useState(
    new Set([validitiyEmployee])
  );

  const selectedValueValidity = React.useMemo(
    () => Array.from(selectedValidity).join(", ").replaceAll("_", " "),
    [selectedValidity]
  );

  const EditEmployee = async () => {
    try {
      const data = {
        id: idEmployee,
        name,
        phone,
        password,
        selectedValueValidity,
      };
      const response = await axios.post(
        `${linkServer.link}users/editemployee`,
        data
      );
      if (response.data === "yes") {
        alert("تم تعديل الموظف بنجاح ✓");
        window.location.reload();
      }
      if (response.data === "no") {
        alert("توجد مشكلة ما حاول مرة أخري 😓");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
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
                      placeholder="إسم الموظف"
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
            </Tab>

            <Tab key="3" title="الصلاحيات">
              <Card>
                <CardBody>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button color="warning" variant="bordered">
                        {selectedValueValidity}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedValueValidity}
                      onSelectionChange={(keys) =>
                        setSelectedValidity(keys as Set<string>)
                      }
                    >
                      <DropdownItem key="موظف">موظف</DropdownItem>
                      <DropdownItem key="أدمن">أدمن</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (
      name.trim() !== nameEmployee ||
      phone.trim() !== phoneEmployee ||
      selectedValueValidity !== validitiyEmployee ||
      password !== passwordEmployee
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [
    name,
    phone,
    password,
    selectedValueValidity,
    nameEmployee,
    phoneEmployee,
    validitiyEmployee,
    passwordEmployee,
  ]);

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
                تعديل الموظف
              </ModalHeader>
              <ModalBody>{tabs()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  onClick={EditEmployee}
                  disabled={closeBtn}
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
