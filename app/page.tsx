"use client";

// react
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import linkServer from "@/linkServer";

//components
import NavBar from "@/components/users/navBar";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import Loading from "@/components/loading";
import MainSlider from "@/components/users/sliders/mainSlider";
import ProductsSlider1 from "@/components/users/sliders/productsSlider1";
import ProductsSliderCatogety from "@/components/users/sliders/productsSliderCatogety";
import ElementsSlider from "@/components/users/sliders/elementsSlider";
import Footer from "@/components/users/footer";
import CartIcon from "@/components/users/cart";

interface Categories {
  _id: string;
  image: string;
  name: string;
  products: string;
  active: boolean;
}

export default function Home() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [categories, setCategories] = useState<Categories[]>([]);
  const [user] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [len, setLen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lenghtProductInCart, setLenghtProductInCart] = useState(0);
  const [lenghtProductInCart2, setLenghtProductInCart2] = useState(0);
  const [lengthProductsInFavourite, setLengthProductsInFavourite] = useState(0);

  const updateLengthInCart1 = (newLength: any) => {
    setLenghtProductInCart(newLength);
  };

  const updateLengthInCart2 = (newLength: any) => {
    setLenghtProductInCart2(newLength);
  };

  const updateLengthInFavourite = (newLength: any) => {
    setLengthProductsInFavourite(newLength);
  };

  const GetProductsInCart = useCallback(async () => {
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
      setLen(response.data.combinedProducts.length);
    } catch (error) {
      console.log(error);
    }
  }, [user, secretKey]);

  useEffect(() => {
    if (user) {
      GetProductsInCart();
    }
  }, [user, GetProductsInCart]);

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
              {/* {lenghtProductInCart} */}
              <NavBar
                userr={user}
                lengthProductsInCart={
                  lenghtProductInCart2 + lenghtProductInCart
                }
                lengthProductsInFavourite={lengthProductsInFavourite}
              />

              <CartIcon
                userr={user}
                lengthProductsInCart={lenghtProductInCart}
                lengthProductsInFavourite={lengthProductsInFavourite}
              />
              <MainSlider />
              <ElementsSlider />
              {/* {lenghtProductInCart2 + lenghtProductInCart} */}
              <ProductsSlider1
                updateLengthInCart={updateLengthInCart1}
                key={0}
                updateLengthInFavoutire={updateLengthInFavourite}
              />

              {/* {lenghtProductInCart2 + lenghtProductInCart} */}
              {categories.map((item, index) => (
                <ProductsSliderCatogety
                  updateLengthInCart={updateLengthInCart2}
                  key={index}
                  catogeryName={item.name}
                />
              ))}

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
