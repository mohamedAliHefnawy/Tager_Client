"use client";

// react
import { useEffect, useState } from "react";
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
import Loading from "@/components/loading";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Pagination,
  Spinner,
} from "@nextui-org/react";

// imgaes
import medicine from "@/public/img/element.png";

//svg
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { DeleteIcon } from "@/public/svg/deleteIcon";
import Link from "next/link";

interface Products {
  _id: string;
  name: string;
  phone: string;
  password: string;
  validity: string;
  image: string;
  price2: number;
  price3: number;
  size: [{ size: string }];
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Products[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const GetProductsInCart = async () => {
    setLoading(true);
    try {
      let response: {
        data: { token: string; combinedProducts: any };
      };
      response = await axios.get(
        `${linkServer.link}favourite/getProductsInFavourite/${user}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setProducts(response.data.combinedProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user]);

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
              className="w-[30%] input"
              onChange={handleSearchChange}
              value={searchText}
            />
          </div>
        </div>
        <div className="gap-2 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-1 max-sm:grid-cols-1">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            currentItems.map((item, index) => (
              <div key={index} className="p-8 py-3 mr-2 h-auto ">
                <div className="flex justify-center rounded-2xl py-4">
                  <Image
                    className="w-[90%] h-36"
                    src={item.image[0]}
                    alt={"error"}
                    width={100}
                    height={100}
                  />
                </div>
                <div className=" rounded-2xl py-2 mt-2">
                  <div
                    // onClick={() =>
                    //   router.push(`/products/${item.catogry}/${item._id}`)
                    // }
                    className="flex justify-center items-center "
                  >
                    <p> {item.name} </p>
                    <p className="text-[var(--mainColor)] ml-1"> ☍ </p>
                  </div>
                  <div className="flex justify-center items-center  ">
                    <p className="flex ">
                      <p className="mr-1">د.ل</p>

                      <p className="font-bold">
                        {userValidity === "زبون عادي"
                          ? item.price3
                          : item.price2}
                      </p>
                    </p>
                  </div>
                  <div className="flex justify-evenly items-center mt-3 ">
                    <ButtonAddToFavourite
                      id={item._id}
                      index={index}
                      size={item.size?.[0]?.size}
                      updateParent={undefined}
                    />

                    <ButtonAddToCart
                      id={item._id}
                      index={index}
                      size={item.size?.[0]?.size}
                      updateParent={undefined}
                    />
                  </div>
                </div>
              </div>
            ))
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
