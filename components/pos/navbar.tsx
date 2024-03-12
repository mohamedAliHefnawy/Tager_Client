"use client";

// react
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

// nextUi
import {
  Tooltip,
  User,
  Spinner,
  Badge,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function NavBarPos({
  categories,
  selectedCatogryParent,
  searchTextFilt,
}: {
  categories: Categories[];
  selectedCatogryParent: any;
  searchTextFilt: any;
}) {
  const [selectedCatogry, setSelectedCatogry] = useState("");
  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (selectedCatogry || searchText) {
      selectedCatogryParent(selectedCatogry);
      searchTextFilt(searchText);
    }
  }, [selectedCatogry, searchText]);

  return (
    <>
      <div className="flex justify-evenly items-center w-[100%] h-[60px] bg-slate-50 rounded-2xl rounded-ss-none rounded-es-none px-4">
        <div className="flex">
          {/* <p
            className="mr-5 font-bold hover:cursor-pointer"
            onClick={() => setSelectedCatogry("")}
          >
            كل المنتجات
          </p> */}
          {categories.map((item, indeItem) => (
            <p
              className="mr-5 font-bold hover:cursor-pointer"
              key={indeItem}
              onClick={() => setSelectedCatogry(item.name)}
            >
              {selectedCatogry === item.name ? (
                <p className="bg-warning-100 p-3 rounded-2xl text-warning-500">
                  {item.name}
                </p>
              ) : (
                <p className=" p-3 rounded-2xl text-warning-300">{item.name}</p>
              )}
            </p>
          ))}
        </div>
        <div className="w-[30%]">
          <input
            className="inputTrue"
            placeholder="بحث ..."
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>
      </div>
    </>
  );
}
