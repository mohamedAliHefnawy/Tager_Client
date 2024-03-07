"use client";

// react
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import linkServer from "@/linkServer";
import Icons from "@/iconsSvg";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import Loading from "@/components/loading";
import SideBarElemnts from "@/components/users/sideBarElemnts";
import ButtonAddToCart from "@/components/users/addTo/cart";
import ButtonAddToFavourite from "@/components/users/addTo/favourite";
import CartIcon from "@/components/users/cart";

//nextUi
import {
  Slider,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Link,
  Pagination,
  Spinner,
} from "@nextui-org/react";

interface Data {
  _id: string;
  name: string;
  size: [{ size: string }];
  color: string;
  name1Product: string;
  price1: number;
  price2: number;
  price3: number;
  amount: number;
  image: string[];
  active: boolean;
  catogry: string | undefined;
}

export default function Home() {
  const [user, userValidity] = useCheckLogin();
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [products, setProducts] = useState<Data[]>([]);
  const [categories, setCategories] = useState<Data[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [cartLength, setCartLength] = useState(0);
  const [lengthProductsInFavourite, setLengthProductsInFavourite] = useState(0);

  const updateCartLength = (length: any) => {
    setCartLength(length);
  };

  const [selectedKeyCategory, setSelectedKeyCategory] = React.useState<
    string[]
  >(["إختر القسم التي تريده"]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedValueCategory = React.useMemo(
    () => Array.from(selectedKeyCategory).join(", ").replaceAll("_", " "),
    [selectedKeyCategory]
  );

  const handleSelectionChangeCategory = (selectedItems: string[]) => {
    setSelectedKeyCategory(selectedItems);
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSliderChange = (newValues: any) => {
    setPriceRange(newValues);
  };

  const getProductPrice = (product: any) => {
    return product.price1;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    const productPrice = getProductPrice(product);
    return (
      (product.name &&
        product.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (product.catogry &&
        product.catogry.toLowerCase().includes(lowerCaseSearchText) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1])
    );
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const GetProducts = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const GetCategories = async () => {
    try {
      let response: { data: { token: string; categories: any } };
      response = await axios.get(`${linkServer.link}categories/getCategories`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetProducts();
    GetCategories();
  }, []);

  useEffect(() => {
    if (user) {
      const timeoutId = setTimeout(() => {
        setUsername(user);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [user]);
  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : user ? (
          <>
            <div className="w-[100%] flex-col flex items-center">
              <NavBar
                userr={user}
                lengthProductsInCart={cartLength}
                lengthProductsInFavourite={lengthProductsInFavourite}
              />
              <>
                <div className="flex lg:w-[90%] md:w-[90%] sm:w-[100%] max-sm:w-[100%]">
                  <div className="lg:w-[90%] md:w-[90%] sm:w-[100%] max-sm:w-[100%]">
                    <div className="py-10 px-10 w-[100%] flex flex-col items-center">
                      <div className="w-[100%]">
                        <input
                          type="text"
                          placeholder=" بحث ..."
                          className="w-[30%] input"
                          onChange={handleSearchChange}
                          value={searchText}
                        />
                      </div>
                      <div className="w-[100%] mt-4">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              startContent={Icons.ArrowUturnDownIcon}
                              variant="bordered"
                              color="warning"
                              className=" w-[100%] lg:hidden md:flex sm:flex max-sm:flex "
                            >
                              {selectedValueCategory}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeyCategory}
                            onSelectionChange={(keys: string[] | any) =>
                              handleSelectionChangeCategory(keys)
                            }
                          >
                            {categories.map((category) => (
                              <DropdownItem key={category.name}>
                                <Link
                                  href={`products/${category.name}`}
                                  key={category.name}
                                >
                                  {category.name}
                                </Link>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      <div className="mt-3 ml-2 text-black text-right opacity-60 text-sm">
                        <p>كل {filteredProducts.length} المنتجات </p>
                      </div>
                      <Slider
                        label="السعر"
                        step={10}
                        minValue={0}
                        maxValue={1000}
                        defaultValue={[1, 1000]}
                        color="warning"
                        className="w-[100%]"
                        onChange={handleSliderChange}
                      />
                    </div>
                    <div className="gap-2 w-[100%] grid grid-cols-2 lg:grid-cols-4 md:sm:grid-cols-4 sm:sm:grid-cols-2 max-sm:sm:grid-cols-2">
                      <>
                        {loading ? (
                          <div className="flex justify-center items-center h-[400px]">
                            <Spinner size="lg" color="warning" />
                          </div>
                        ) : (
                          currentItems.map((product, index) => (
                            <>
                              <div
                                key={index}
                                className="p-8 py-3 mr-2 h-auto "
                              >
                                <div className="flex justify-center rounded-2xl py-4">
                                  <Image
                                    className="w-[90%] h-36"
                                    src={product.image[0]}
                                    alt={"error"}
                                    width={100}
                                    height={100}
                                  />
                                </div>
                                <div className=" rounded-2xl py-2 mt-2">
                                  <div
                                    onClick={() =>
                                      router.push(
                                        `/products/${product.catogry}/${product._id}`
                                      )
                                    }
                                    className="flex justify-center items-center hover:cursor-pointer text-sm "
                                  >
                                    <p> {product.name} </p>
                                    <p className="text-[var(--mainColor)] ml-1">
                                      ☍
                                    </p>
                                  </div>
                                  <div className="flex justify-center items-center  ">
                                    <p className="flex ">
                                      <p className="mr-1">د.ل</p>

                                      <p className="font-bold">
                                        {userValidity !== "مندوب تسويق"
                                          ? product.price3
                                          : product.price2}
                                      </p>
                                    </p>
                                  </div>
                                  <div className="flex justify-evenly items-center mt-3 ">
                                    <ButtonAddToFavourite
                                      id={product._id}
                                      index={index}
                                      updateParent={updateCartLength}
                                      size={product.size[0].size}
                                    />

                                    <ButtonAddToCart
                                      id={product._id}
                                      index={index}
                                      updateParent={updateCartLength}
                                      size={product.size[0].size}
                                    />
                                  </div>
                                </div>
                              </div>

                              <CartIcon
                                userr={user}
                                lengthProductsInCart={cartLength}
                                lengthProductsInFavourite={
                                  lengthProductsInFavourite
                                }
                              />
                            </>
                          ))
                        )}

                        <div className="pagination pl-6">
                          <Pagination
                            className=" mb-3"
                            showShadow
                            color="warning"
                            variant="faded"
                            total={Math.ceil(
                              filteredProducts.length / itemsPerPage
                            )}
                            initialPage={currentPage}
                            onChange={handlePageChange}
                          />
                        </div>
                      </>
                    </div>
                  </div>
                  <div className=" w-[25%] lg:flex md:hidden sm:hidden max-sm:hidden ">
                    <SideBarElemnts />
                  </div>
                </div>
              </>
              <Footer />
            </div>
          </>
        ) : (
          <DivCheck link="/auth/login" />
        )}
      </div>
    </>
  );
}
