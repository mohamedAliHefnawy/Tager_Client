//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUnixTime } from "date-fns";
import linkServer from "@/linkServer";
import Swal from "sweetalert2";

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

export default function ModelAddSupplier() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageURL, setImageURL] = useState("");
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
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
            placeholder="إسم المورد"
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
        </form>
      </>
    );
  };

  const AddEmployee = async () => {
    try {
      const data = { name, phone, imageURL };
      const response = await axios.post(
        `${linkServer.link}suppliers/addSuppliers`,
        data
      );
      if (response.data === "yes") {
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة بنجاح",
          text: "✓",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        window.location.reload();
      }
      if (response.data === "no") {
        Swal.fire({
          icon: "warning",
          title: "هذا المورد موجود بالفعل",
          text: "⤫",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "حسنًا",
        });
        setName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (name.trim() !== "" && phone.trim() !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [name, phone]);

  return (
    <>
      <Button
        onPress={onOpen}
        color="warning"
        className="h-14 mt-4"
        startContent={Icons.PlusIcon}
      >
        إضافة مورد
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
                إضافة مورد
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
