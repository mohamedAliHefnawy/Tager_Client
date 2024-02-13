//react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
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
  Switch,
} from "@nextui-org/react";

//svgIcons
import { PlusIcon } from "../../../../public/svg/plusIcon";
import { FingerPrintIcon } from "../../../../public/svg/fingerprintIcon";
import { PhotoIcon } from "../../../../public/svg/photoIcon";
import { PencilIcon } from "../../../../public/svg/pencilIcon";

export default function ModelEditCategory({
  idCategoryy,
  nameCategoryy,
  imageCategoryy,
  activeCategoryy,
}: {
  idCategoryy: string;
  nameCategoryy: string;
  imageCategoryy: string;
  activeCategoryy: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [img, setImg] = useState("");
  const [nameCatogry, setNameCatogry] = useState(nameCategoryy);
  const [imageCatogry, setImageCatogry] = useState(imageCategoryy);
  const [closeBtn, setCloseBtn] = useState(true);
  const [imageURL, setImageURL] = useState(imageCategoryy);
  const [active, setActive] = React.useState(activeCategoryy);

  const Icons = {
    PlusIcon: <PlusIcon />,
    FingerPrintIcon: <FingerPrintIcon />,
    PhotoIcon: <PhotoIcon />,
    PencilIcon: <PencilIcon />,
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
        <div className="flex items-center">
          {!img ? (
            <label
              htmlFor="img"
              className="p-0 rounded-full text-black hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
            >
              <Avatar size="lg" src={imageCatogry} />
            </label>
          ) : (
            <label
              htmlFor="img"
              className="p-0 rounded-full text-black hover:cursor-pointer  bg-[var(--mainColorRgba)] border-1 border-[var(--mainColor)]"
            >
              <Avatar size="lg" src={imageURL} />
            </label>
          )}
          <Switch
            isSelected={active}
            onValueChange={setActive}
            color="warning"
            className="rotate-90"
          ></Switch>
        </div>
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

  const EditCatogry = async () => {
    try {
      const data = {
        idCategoryy,
        nameCatogry,
        imageURL,
        active,
      };
      const response = await axios.post(
        `${linkServer.link}categories/editCatgory  `,
        data
      );
      if (response.data === "yes") {
        toast.info("تم تعديل القسم بنجاح ✓");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      imageURL !== imageCategoryy ||
      nameCatogry.trim() !== nameCategoryy ||
      active
    ) {
      setCloseBtn(false);
    } else {
      setCloseBtn(true);
    }
  }, [imageURL, nameCatogry]);

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
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تعديل قسم ({nameCategoryy})
              </ModalHeader>
              <ModalBody>{Body()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  color={closeBtn ? "default" : "warning"}
                  onClick={EditCatogry}
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
