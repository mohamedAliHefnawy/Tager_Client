"use client";

// react
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import ButtonAddToCart from "@/components/users/addTo/cart";
import ButtonAddToFavourite from "@/components/users/addTo/favourite";
import MoadelOrderProducts from "@/components/users/models/orderProducts/moadelOrderProduct";
import Loading from "@/components/loading";

import { Pagination, Spinner } from "@nextui-org/react";

interface Products {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  size: [{ store: [{ amount: number; nameStore: string }]; size: string }];
  store: { amount: number }[];
  [key: string]: any;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Products[]>([]);
  const [sizes, setSizes] = useState<Products[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [counter, setCounter] = useState(0);
  const router = useRouter();
  const itemsPerPage = 20;

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      (product.name &&
        product.name.toLowerCase().includes(lowerCaseSearchText)) ||
      (product.password &&
        product.password.toLowerCase().includes(lowerCaseSearchText)) ||
      (product.phone &&
        product.phone.toLowerCase().includes(lowerCaseSearchText))
    );
  });

  const handleAddToCart = (idToRemove: any) => {
    const updatedProducts = products.filter(
      (product) => product._id !== idToRemove
    );
    setProducts(updatedProducts);
  };

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const DeleteProductWithCart = (id: any) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);
  };

  const Size = (id: any) => {
    return sizes.find((item2) => item2[0] === id)?.[1];
  };

  const Amount = (size: any, id: any) => {
    return size
      .filter((item2: any) => item2.size === Size(id))
      .map((item3: any) =>
        item3.store.reduce((acc: any, calc: any) => acc + calc.amount, 0)
      );
  };

  const GetProductsInCart = useCallback(async () => {
    setLoading(true);
    try {
      let response: {
        data: { token: string; combinedProducts: any; combinedProducts2: any };
      };
      response = await axios.get(
        `${linkServer.link}cart/getProductsInCart/${user}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setProducts(response.data.combinedProducts);
      setSizes(response.data.combinedProducts2);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProducts, setSizes, user, secretKey]);

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user, GetProductsInCart]);

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

  const Body = () => {
    return (
      <>
        <div className="w-[90%] flex justify-end mt-8">
          <div className="w-[100%]">
            <input
              type="text"
              placeholder=" بحث ..."
              className="w-[90%] input"
              onChange={handleSearchChange}
              value={searchText}
            />
          </div>
        </div>
        <div className="gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 max-sm:grid-cols-2">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((item, index) => (
              <div key={index} className="p-8 py-3 mr-2 h-auto">
                <div className="flex justify-center rounded-2xl py-4">
                  <Image
                    className="w-[90%] h-36"
                    src={item.image[0]}
                    alt={"error"}
                    width={100}
                    height={100}
                  />
                  {/* {Size(item._id)} */}
                  {/* {products.map((item) => item._id)} */}
                </div>
                <div className=" rounded-2xl py-2 mt-2">
                  <div className="text-red-500 flex justify-center py-2">
                    {Amount(item.size, item._id) <= 0 && <p>غير متوفر</p>}
                  </div>
                  <div
                    // onClick={() =>
                    //   router.push(`/products/${item.catogry}/${item._id}`)
                    // }
                    className="flex justify-center items-center text-sm"
                  >
                    <p> {item.name} </p>
                    {/* <p> {Size(item._id)} </p> */}

                    <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="flex">
                      <p className="flex">
                        <p className="mr-1">د.ل</p>
                        <p className="font-bold text-sm">
                          {userValidity !== "مندوب تسويق"
                            ? item.price3
                            : item.price2}
                        </p>
                      </p>
                      {/* <p style={{ direction: "rtl" }} className="ml-2">
                        السعر :
                      </p> */}
                    </p>
                    {/* <p className="flex">
                      <p className="flex">
                        <p className="mr-1">د.ل</p>
                        <p className="font-bold">{item.gainMarketer}</p>
                      </p>
                      <p style={{ direction: "rtl" }} className="ml-2">
                        {" "}
                        الربح :{" "}
                      </p>
                    </p> */}
                  </div>
                  <div className="flex justify-evenly items-center mt-3 ">
                    <ButtonAddToFavourite
                      id={item._id}
                      index={index}
                      size={item.size?.[0]?.size}
                      updateParent={undefined}
                    />
                    <p onClick={() => DeleteProductWithCart(item._id)}>
                      <ButtonAddToCart
                        id={item._id}
                        index={index}
                        size={item.size?.[0]?.size}
                        updateParent={undefined}
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {counter <= 0 ? (
            <MoadelOrderProducts
              nameUser={user}
              validityUser={userValidity}
              Productss={products}
              sizeProductss={sizes}
            />
          ) : (
            <>
              <div className="p-12 py-8 mr-2 h-auto flex justify-center items-center ">
                <div className="bg-orange-200 w-4 h-4 rotate-45 mt-1 rounded-lg"></div>
                <div className="bg-red-200 p-4 rounded-lg hover:cursor-pointer">
                  إستكمال الطلب
                </div>
              </div>
            </>
          )}
        </div>
        <div className="pagination">
          <Pagination
            className="fixed bottom-0 mb-3"
            showShadow
            color="primary"
            total={Math.ceil(filteredProducts.length / itemsPerPage)}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    const unavailableProductsCount = currentItems.reduce((count, item) => {
      if (Amount(item.size, item._id) <= 0) {
        return count + 1;
      }
      return count;
    }, 0);
    setCounter(unavailableProductsCount);
  }, [currentItems]);

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
                lengthProductsInCart={0}
                lengthProductsInFavourite={0}
              />
              {Body()}
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
