//react
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";

//nextUi
import {
  Avatar,
  Spinner,
  Pagination,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";

//components
import ModelAddProduct from "../modals/products/modelAddProduct";
import ModelEditProduct from "../modals/products/modelEditProduct";

interface Row {
  id: string;
  cost: string;
  image: string;
  price1?: string;
  price2: string;
  price3: string;
  catogry: string | undefined;
  name: string;
  marketer: string;
  gainMarketer: string;
  regularCustomer: string;
  color: string;
  size: [{ size: string; store: [{ amount: number }] }];
  images: string[];
  dynamicInputs: string[];
}

interface Product {
  _id: string;
  name: string;
  size: [{ size: string; store: [{ amount: number }] }];
  color: string;
  name1Product: string;
  price1: string;
  price2: string;
  price3: string;
  gainMarketer: string;
  image: string[];
  products: Row[];
  active: boolean;
  catogry: string | undefined;
}

export default function Products() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [products, setProducts] = useState<Product[]>([]);
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
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      product.name && product.name.toLowerCase().includes(lowerCaseSearchText)
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleAddProduct = (newProduct: Product) => {
    const convertedProduct: Product = {
      _id: newProduct._id,
      name: newProduct.name,
      name1Product: newProduct.name1Product,
      image: newProduct.image,
      products: newProduct.products.map((row) => {
        return {
          ...row,
          category: row.catogry,
          name: newProduct.name,
          catogry: newProduct.catogry,
          image: row.images[0],
        };
      }),

      active: newProduct.active,
      size: [{ size: "", store: [{ amount: 0 }] }],
      catogry: newProduct.catogry,
      price1: newProduct.price1,
      color: "",
      price2: "",
      price3: "",
      gainMarketer: "",
    };

    setProducts((prevnProduct: Product[]) => [
      ...prevnProduct,
      convertedProduct,
    ]);
  };

  const GetProducts = async () => {
    try {
      let response: { data: { token: string; products: any } };
      response = await axios.get(`${linkServer.link}products/getProducts`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetProducts();
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
          <ModelAddProduct
            nameProductt={nameCatogry}
            setNameProductt={setNameCatogry}
            imageURLL={imageURL}
            setImageURLL={setImageURL}
            onAddProductt={handleAddProduct}
          />
        </div>
        <div className="mt-3 ml-2 text-black opacity-60 text-sm">
          <p>Total {filteredProducts.length} Categories </p>
        </div>

        <div>
          <div className="flex items-center mt-4 mb-3 p-4 pr-10 pl-10 bg-[var(--mainColorRgba)] shadow-lg shadow-[var(--mainColorRgba)] rounded-2xl text-black opacity-75">
            <div className="w-[20%]">
              <p>الصورة</p>
            </div>
            <div className="w-[30%] text-center">
              <p>الإسم</p>
            </div>
            <div className="w-[30%] text-center">
              <p>القسم</p>
            </div>
            <div className="w-[30%] text-center">
              <p>المنتجات الفرعية</p>
            </div>
            <div className="w-[30%] text-center">
              <p>السعر</p>
            </div>
            <div className="w-[30%] text-center">
              <p>الكمية</p>
            </div>

            <div className="w-[10%] text-right"></div>
          </div>
          {
            // loading ? (
            //   <div className="flex justify-center items-center h-[400px]">
            //     <Spinner size="lg" color="warning" />
            //   </div>
            // ) : (
            currentItems.map((product, index) => (
              <>
                <div
                  key={index}
                  className="flex flex-col justify-center  p-4 pr-10 pl-10 bg-[var(--mainColorRgbaa)] shadow-lg rounded-2xl border-1 mb-1 border-[var(--mainColor)] text-black opacity-75"
                >
                  <div className="flex items-center w-[100%]">
                    <div className="w-[20%]">
                      <Avatar src={product.image[0]} />
                    </div>
                    <div className="w-[30%] text-center">
                      <p> {product.name} </p>
                    </div>
                    <div className="w-[30%] text-center">
                      <p> {product.catogry} </p>
                    </div>
                    <div className="w-[30%]">
                      <p className="flex justify-center">
                        <p className="mr-1"> منتج</p>
                        <p> {product.products.length}</p>
                      </p>
                    </div>
                    <div className="w-[30%]  ">
                      <p className="flex justify-center">
                        <p className="mr-1"> د.ل</p>
                        <p> {product.price1}</p>
                      </p>
                    </div>
                    <div className="w-[30%]  ">
                      <p className="flex justify-center">
                        {product.size.reduce(
                          (calc, sum) =>
                            calc +
                            sum.store.reduce(
                              (calc2, sum2) => calc2 + sum2.amount,
                              0
                            ),
                          0
                        )}
                      </p>
                    </div>

                    <div className="w-[10%] text-right">
                      <div className="flex justify-center">
                        <ModelEditProduct
                          idProductt={product._id}
                          nameProductt={product.name}
                          nameCategoryy={product.catogry}
                          imagesProductt={product.image}
                          price1Productt={product.price1}
                          price2Productt={product.price2}
                          price3Productt={product.price3}
                          price4Productt={product.gainMarketer}
                          colorProductt={product.color}
                          sizeProductt={product.size}
                          allProductt={product.products}
                        />
                      </div>
                    </div>
                  </div>
                  {product.products.length > 0 && (
                    <Accordion>
                      <AccordionItem>
                        {product.products.map((products2, index) => (
                          <div
                            key={index}
                            className="flex items-center mt-3 w-[100%]"
                          >
                            <div className="w-[20%]">
                              <Avatar src={products2.image} />
                            </div>
                            <div className="w-[30%] text-center">
                              <p>{products2.name}</p>
                            </div>
                            <div className="w-[30%] text-center">
                              <p>{products2.catogry}</p>
                            </div>
                            <div className="w-[30%]">
                              <p className="flex justify-center">
                                <p>-</p>
                              </p>
                            </div>
                            <div className="w-[30%]  ">
                              <p className="flex justify-center">
                                <p className="mr-1"> د.ل</p>
                                <p> {products2.price1}</p>
                              </p>
                            </div>
                            <div className="w-[30%]  ">
                              <p className="flex justify-center">
                                {products2.size.reduce(
                                  (calc, sum) =>
                                    calc +
                                    sum.store.reduce(
                                      (calc2, sum2) => calc2 + sum2.amount,
                                      0
                                    ),
                                  0
                                )}
                              </p>
                            </div>
                            <div className="w-[10%] text-right">
                              <div className="flex justify-center">
                                {/* <ModelEditProduct
                idCategoryy={product._id}
                nameCategoryy={product.name}  
                imageCategoryy={product.image[0]}
                activeCategoryy={product.active}
              /> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </>
            ))
            // )
          }
        </div>
        <div className="pagination">
          <Pagination
            className=" mb-3"
            showShadow
            color="primary"
            variant="faded"
            total={Math.ceil(filteredProducts.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
