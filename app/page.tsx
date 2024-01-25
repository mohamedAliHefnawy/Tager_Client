"use client";

// react
import { useEffect, useState } from "react";

//components
import NavBar from "@/components/users/navBar";
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import DivCheck from "@/components/users/checkLogin/divCheck";
import Loading from "@/components/loading";
import MainSlider from "@/components/users/sliders/mainSlider";
import ProductsSlider1 from "@/components/users/sliders/productsSlider1";
import ProductsSlider2 from "@/components/users/sliders/productsSlider2";
import ElementsSlider from "@/components/users/sliders/elementsSlider";
import Footer from "@/components/users/footer";

export default function Home() {
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
              <ProductsSlider2
                updateLengthInCart={undefined}
                updateLengthInFavoutire={undefined}
              />
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
