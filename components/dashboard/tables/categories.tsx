//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//nextUi
import { Avatar, Spinner, Pagination } from "@nextui-org/react";

//components
import ModelAddCategory from "../modals/categories/modelAddCategory";
import ModelEditCategory from "../modals/categories/modelEditCategory";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function Categories() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [categories, setCategories] = useState<Categories[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const [nameCatogry, setNameCatogry] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredCategories = categories.filter((category) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      category.name && category.name.toLowerCase().includes(lowerCaseSearchText)
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddCategory = (newCategory: Categories) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
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
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCategories();
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
          <ModelAddCategory
            nameCatogryy={nameCatogry}
            setNameCatogryy={setNameCatogry}
            imageURLL={imageURL}
            setImageURLL={setImageURL}
            onAddCategoryy={handleAddCategory}
          />
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredCategories.length} Categories </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[15%]">
              <p>الصورة</p>
            </div>
            <div className="w-[25%]">
              <p>الإسم</p>
            </div>
            <div className="w-[25%]">
              <p>عدد المنتجات</p>
            </div>
            <div className="w-[25%]">
              <p>الحالة</p>
            </div>

            <div className="w-[33%] text-right"></div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((category, index) => (
              <div
                key={index}
                className="flex items-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
              >
                <div className="w-[15%]">
                  <Avatar src={category.image} />
                </div>
                <div className="w-[25%]">
                  <p> {category.name} </p>
                </div>
                <div className="w-[25%]">
                  <p className="flex">
                    <p className="mr-1"> منتج</p>
                    <p> {category.products.length}</p>
                  </p>
                </div>
                <div className="w-[25%] ">
                  {category.active === true ? (
                    <p className="text-success-600">نشط</p>
                  ) : (
                    <p className="text-danger-600">خامل</p>
                  )}
                </div>

                <div className="w-[33%] text-right">
                  <div className="flex justify-center">
                    <ModelEditCategory
                      idCategoryy={category._id}
                      nameCategoryy={category.name}
                      imageCategoryy={category.image}
                      activeCategoryy={category.active}
                    />
                  </div>
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
            total={Math.ceil(filteredCategories.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
