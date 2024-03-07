//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Icons from "@/iconsSvg";

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
} from "@nextui-org/react";

//component
import checkLogin from "./checkLogin/checkLogin";

export default function Model() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [check, setCheck] = useState(true);

  const [usernamee] = checkLogin();
  const imagebase64 = async (file: any) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };

  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    const image = (await imagebase64(file)) as string;
    setImg(image);
  };

  useEffect(() => {
    if (name.trim() !== usernamee) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [name, usernamee]);

  return (
    <>
      <Button onPress={onOpen} variant="faded" color="primary">
        <p> تعديل البيانات </p>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تعديل البيانات
              </ModalHeader>
              <ModalBody>
                <form
                  action=""
                  className="flex flex-col justify-center items-center"
                >
                  <label
                    htmlFor="upload"
                    className=" bg-slate-300 text-slate-500 text-8xl border-2 border-primary-400  hover:cursor-pointer w-[20%] h-[80px] flex justify-center items-center rounded-full "
                  >
                    {img ? (
                      <Image
                        alt="error"
                        width={300}
                        height={400}
                        src={img}
                        className="rounded-full"
                      />
                    ) : (
                      Icons.PhotoIcon
                    )}
                  </label>
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                  <Input
                    type="email"
                    defaultValue={usernamee}
                    variant="flat"
                    color="default"
                    className="max-w-xs mt-4 border-1 border-primary-400 rounded-xl"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="email"
                    defaultValue="123"
                    variant="flat"
                    color="default"
                    className="max-w-xs mt-4 border-1 border-primary-400 rounded-xl"
                    onChange={(e) => setName(e.target.value)}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={check ? "default" : "primary"}
                  onPress={onClose}
                  disabled={check}
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
