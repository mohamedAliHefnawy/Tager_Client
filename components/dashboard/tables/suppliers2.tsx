//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import linkServer from "@/linkServer";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import ModaelAddPurchase from "../modals/purchases/modaelAddPurchase";

interface Supplier {
  _id: string;
  image: string;
  name: string;
  phone: string;
  products: string;
  active: boolean;
}

export default function Supplier2() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [imageURL, setImageURL] = useState("");
  const [categories, setCategories] = useState<Supplier[]>([]);
  const [nameCatogry, setNameCatogry] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredSupplier = supplier.filter((supplier) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      supplier.name && supplier.name.toLowerCase().includes(lowerCaseSearchText)
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredSupplier.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // const handleAddCategory = (newCategory: Supplier) => {
  //   const convertedCategory: Supplier = {
  //     _id: newCategory._id,
  //     name: newCategory.name,
  //     image: "",
  //     phone: "",
  //     products: "",
  //     active: false,
  //   };

  //   setCategories((prevCategories: Supplier[]) => [
  //     ...prevCategories,
  //     convertedCategory,
  //   ]);
  // };

  const GetSuppliers = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; suppliers: any } };
      response = await axios.get(
        `${linkServer.link}suppliers/getSuppliers`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setSupplier(response.data.suppliers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetSuppliers();
  }, []);

  return (
    <>
      <div className=" w-[100%]">
        <div className="flex justify-between items-center">
          <div className="w-[50%]">
            <input
              type="text"
              placeholder=" بحث ..."
              className="w-[30%] input"
              onChange={handleSearchChange}
              value={searchText}
            />
          </div>
          <ModaelAddPurchase
            // nameCatogryy={nameCatogry}
            // setNameCatogryy={setNameCatogry}
            // imageURLL={imageURL}
            // setImageURLL={setImageURL}
            // onAddProductt={handleAddCategory}
            supplier={supplier}
          />
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredSupplier.length} Categories </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[15%]">
              <p>الصورة</p>
            </div>
            <div className="w-[25%] text-center">
              <p>الإسم</p>
            </div>
            <div className="w-[25%] text-center">
              <p> الهاتف</p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((supplier, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[15%]">
                  <Avatar src={supplier.image} />
                </div>
                <div className="w-[25%] text-center">
                  <Link href={`/dashboard/purchases/${supplier.name}`}>
                    {/* <p className="text-warning-300 hover:text-warning-200 hover:cursor-pointer"> */}
                    {supplier.name}
                    {/* </p> */}
                  </Link>
                </div>
                <div className="w-[25%] text-center">
                  <p> {supplier.phone} </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          <Pagination
            className=" mb-3"
            showShadow
            color="primary"
            variant="faded"
            total={Math.ceil(filteredSupplier.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
