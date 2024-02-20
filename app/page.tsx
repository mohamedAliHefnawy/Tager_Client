"use client";

// react
import { useEffect, useState } from "react";
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
  const [userName, userValidity] = useCheckLogin();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lenghtProductInCart, setLenghtProductInCart] = useState(0);
  const [lengthProductsInFavourite, setLengthProductsInFavourite] = useState(0);

  const updateLengthInCart = (newLength: any) => {
    setLenghtProductInCart(newLength);
  };

  const updateLengthInFavourite = (newLength: any) => {
    setLengthProductsInFavourite(newLength);
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
    GetCategories();
  }, []);

  useEffect(() => {
    if (userName) {
      const timeoutId = setTimeout(() => {
        setUsername(userName);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setIsLoading(false);
    }
  }, [userName]);

  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : userName ? (
          <>
            <div className="w-[100%] flex-col flex items-center">
              <NavBar
                user={userName}
                lengthProductsInCart={lenghtProductInCart}
                lengthProductsInFavourite={lengthProductsInFavourite}
              />
              <MainSlider />
              <ElementsSlider />
              <ProductsSlider1
                updateLengthInCart={updateLengthInCart}
                updateLengthInFavoutire={updateLengthInFavourite}
              />

              {categories.map((item, index) => (
                <ProductsSliderCatogety key={index} catogeryName={item.name} />
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
