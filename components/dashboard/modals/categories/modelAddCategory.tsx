//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getUnixTime } from "date-fns";
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
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "@/public/svg/plusIcon";
import { FingerPrintIcon } from "@/public/svg/fingerprintIcon";
import { PhotoIcon } from "@/public/svg/photoIcon";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

interface ModelAddCategoryProps {
  nameCatogryy: string;
  setNameCatogryy: React.Dispatch<React.SetStateAction<string>>;
  imageURLL: string;
  setImageURLL: React.Dispatch<React.SetStateAction<string>>;
  onAddCategoryy: (newCategory: Categories) => void;
}

export default function ModelAddCategory({
  nameCatogryy,
  setNameCatogryy,
  imageURLL,
  setImageURLL,
  onAddCategoryy,
}: ModelAddCategoryProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [img, setImg] = useState("");
  const [nameCatogry, setNameCatogry] = useState("");
  const [closeBtn, setCloseBtn] = useState(true);
  const [imageURL, setImageURL] = useState("");

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
      console.log(url);
    } else {
      alert("Please select a file");
    }
  };

  const Body = () => (
    <div className="p-4 flex flex-col items-center">
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
      <div className="w-[100%] flex justify-center">
        <input
          type="text"
          id="img"
          className="input"
          placeholder="إسم القسم"
          value={nameCatogry}
          onChange={(e) => setNameCatogry(e.target.value)}
        />
      </div>
    </div>
  );

  const AddCatogry = async () => {
    try {
      const data = {
        nameCatogry,
        imageURL,
      };
      const response = await axios.post(
        `${linkServer.link}categories/addCatgory`,
        data
      );
      if (response.data === "yes") {
        onAddCategoryy({
          _id: new Date().toISOString(),
          name: nameCatogry,
          image: imageURL,
          products: "",
          active: true,
        });
        setNameCatogry("");
        setImageURL("");

        toast.success("تم إضافة القسم بنجاح ✓");
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
    if (imageURL !== "" && nameCatogry.trim() !== "") {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [imageURL, nameCatogry]);

  return (
    <>
      <ToastContainer />
      <Button
        onPress={onOpen}
        color="warning"
        className="mt-5 h-14 opacity-90 rounded-full px-4"
        startContent={Icons.PlusIcon}
      >
        <p> إضافة قسم </p>
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p> إضافة قسم </p>
              </ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  disabled={closeBtn}
                  onClick={AddCatogry}
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
