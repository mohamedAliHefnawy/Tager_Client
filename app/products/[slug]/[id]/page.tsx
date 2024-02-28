"use client";

//react
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import linkServer from "@/linkServer";

//components
import useCheckLogin from "@/components/users/checkLogin/checkLogin";
import useProducts from "@/components/users/checkLogin/carts";
import DivCheck from "@/components/users/checkLogin/divCheck";
import NavBar from "@/components/users/navBar";
import Footer from "@/components/users/footer";
import Loading from "@/components/loading";
import MoadelOrderProduct from "@/components/users/models/orderProduct/moadelOrderProduct";
import ButtonAddToCart from "@/components/users/addTo/cart";
import ButtonAddToFavourite from "@/components/users/addTo/favourite";

// svgIcon
import { ShoppingcartIcon } from "@/public/svg/shoppingcartIcon";
import { HeartIcon } from "@/public/svg/heartIcon";
import { HeartIcon2 } from "@/public/svg/heartIcon2";

//nextUi
import { Button } from "@nextui-org/react";
import CartIcon from "@/components/users/cart";

interface Store {
  nameStore: string;
  amount: number;
  price2: number;
  _id: string;
}

interface Size {
  size: string;
  _id: string;
  store: Store[];
}

interface Product {
  name: string;
  image: string[];
  catogry: string;
  price1: number;
  price2: number;
  price3: number;
  gainMarketer: number;
  color: string;
  size: Size[];
  _id: string;
}

interface Data {
  _id: string;
  name: string;
  image: string[];
  catogry: string;
  price1: number;
  price2: number;
  price3: number;
  gainMarketer: number;
  color: string;
  size: Size[];
  products: Product[];
  __v: number;
}

export default function Product({ params }: { params: { id: string } }) {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [user, userValidity] = useCheckLogin();
  const [products] = useProducts();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Data>({
    _id: "",
    name: "",
    image: [],
    catogry: "",
    price1: 0,
    price2: 0,
    price3: 0,
    gainMarketer: 0,
    color: "",
    size: [],
    products: [],
    __v: 0,
  });
  const [selectedColor, setSelectedColor] = useState(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [displayedPriceRealy, setDisplayedPriceRealy] = useState(0);
  const [displayedGain, setDisplayedGain] = useState(0);
  const [displayedId, setDisplayedId] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [cartLength, setCartLength] = useState(0);

  const updateCartLength = (length: any) => {
    setCartLength(length);
  };

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const allSizes = Array.from(
    new Set([
      ...(product.size || []).map((s: any) => s.size),
      ...(product.products || [])
        .flatMap((product) => product.size || [])
        .map((s: any) => s.size),
    ])
  );

  const allColors = Array.from(
    new Set([
      product.color || "",
      ...(product.products || []).flatMap((product) => product.color || ""),
    ])
  );

  const allProducts = [
    ...(product.size ? [product] : []),
    ...(product.name ? [product] : []),
    ...(product.price1 ? [product] : []),
    ...(product.price2 ? [product] : []),
    ...(product.gainMarketer ? [product] : []),
    ...(product._id ? [product] : []),
    ...(product.products || []),
  ].flatMap((p) => [
    {
      color: p.color,
      name: p.name,
      _id: p._id,
      price1: p.price1,
      price2: p.price2,
      price3: p.price3,
      gainMarketer: p.gainMarketer,
      size: (p.size || [])[0]?.size,
    },
    ...(p.size || []).map((s: any) => ({
      color: p.color,
      price1: p.price1,
      price3: p.price3,
      price2: p.price2,
      gainMarketer: p.gainMarketer,
      size: s.size,
      name: s.name,
      _id: s._id,
    })),
  ]);

  const allProductss = [
    ...(product.size ? [product] : []),
    ...(product.products || []),
  ];

  const allProductsImages = [
    ...(product ? [product] : []),
    ...(product?.products || []),
  ];

  const handleColorClick = (selectedColor: any) => {
    setSelectedColor(selectedColor);
    const productWithSelectedColor = allProducts.find(
      (product) => product.color === selectedColor
    );
    if (productWithSelectedColor) {
      setDisplayedId(productWithSelectedColor._id);
      setDisplayedName(productWithSelectedColor.name);
      const priceForUser =
        userValidity !== "مندوب تسويق"
          ? productWithSelectedColor.price3
          : productWithSelectedColor.price2;
      setDisplayedPrice(priceForUser);
      setDisplayedPriceRealy(productWithSelectedColor.price1);
      const gain = productWithSelectedColor.gainMarketer;
      setDisplayedGain(gain);
      const selectedProductImages = allProductsImages.filter(
        (item: any) => item.color === selectedColor
      );
      setProductImages(
        selectedProductImages.map((item: any) => item.image).flat() || []
      );
    }
  };

  const handleSizeClick = (selectedSize: any) => {
    setSelectedSize(selectedSize);
  };

  const getAvailableQuantity = (selectedColor: any, selectedSize: any) => {
    const productWithSelectedColor = allProductss.find(
      (product: any) => product.color === selectedColor
    );

    if (
      productWithSelectedColor &&
      Array.isArray(productWithSelectedColor.size)
    ) {
      const selectedProductSize = productWithSelectedColor.size.find(
        (size: any) => {
          return (
            size.size === selectedSize &&
            size.store.some((store: any) => store.amount > 0)
          );
        }
      );

      const selectedProductStore = productWithSelectedColor.size.find(
        (size: any) => {
          return size.size === selectedSize && size.store;
        }
      );

      if (selectedProductSize) {
        const totalAmount = selectedProductSize.store.reduce(
          (acc: any, store: any) => {
            return acc + store.amount;
          },
          0
        );

        return totalAmount;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const getAvailableStores = (selectedColor: any, selectedSize: any) => {
    const productWithSelectedColor = allProductss.find(
      (product) => product.color === selectedColor
    );
    if (
      productWithSelectedColor &&
      Array.isArray(productWithSelectedColor.size)
    ) {
      const selectedProductStore = productWithSelectedColor.size.find(
        (size: any) => {
          return size.size === selectedSize && size.store;
        }
      );

      if (selectedProductStore) {
        return selectedProductStore.store;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const availableQuantity = getAvailableQuantity(selectedColor, selectedSize);
  const availableStores = getAvailableStores(selectedColor, selectedSize);

  const Body = () => {
    return (
      <>
        <div className="py-20 px-6  lg:flex md:flex sm:block max-sm:block justify-end w-[100%]">
          <div className="lg:hidden md:hidden sm:flex max-sm:flex lg:w-[33%] md:w-[33%] sm:w-[90%] max-sm:w-[90%] h-auto flex justify-center p-6">
            <div className="w-[100%]">
              <Slider {...settings}>
                {productImages &&
                  productImages.map((img, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center"
                    >
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="object-cover w-[100%]"
                      />
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
          <div className="p-6">
            <p className="flex justify-end font-bold text-xl">
              <p className="mr-1">د.ل</p>
              <p>{displayedPrice}</p>
            </p>
            <p className="my-1 mt-6  text-lg text-[var(--mainColor)]">
              <p style={{ direction: "rtl" }}>الحالة :</p>
            </p>
            <p className="">
              <p style={{ direction: "rtl" }}>
                {availableQuantity > 0 ? (
                  <p className="text-success-600">متوفر</p>
                ) : (
                  <p className="text-danger-600">غير متوفر</p>
                )}
                {/* قطعة */}
              </p>
            </p>
            {/* {cartLength} */}
            <p className="my-1 mt-6 text-[var(--mainColor)] text-lg">
              <p style={{ direction: "rtl" }}>الأحجام :</p>
            </p>
            <p className="flex justify-end mt-2">
              {allSizes.map((size, index) => (
                <span key={index} className="mr-3 hover:cursor-pointer">
                  <div
                    onClick={() => handleSizeClick(size)}
                    style={{
                      backgroundColor: selectedSize === size ? "#333" : "#fff",
                      color: selectedSize === size ? "#fff" : "#000",
                      border: "1px solid #ccc",
                    }}
                    className={`w-auto h-auto p-2 border-1 border-white outline-2 outline-double outline-slate-200`}
                  >
                    {size}
                  </div>
                </span>
              ))}
            </p>
            <p className="my-1 mt-6 text-[var(--mainColor)] text-lg">
              <p style={{ direction: "rtl" }}>الألوان :</p>
            </p>
            <p className="flex justify-end mt-4">
              {allColors.map((color, index) => (
                <span key={index} className="mr-6 hover:cursor-pointer">
                  <div
                    onClick={() => handleColorClick(color)}
                    style={{
                      backgroundColor: color,
                      outlineColor: color,
                      border:
                        selectedColor === color
                          ? "0px solid red"
                          : `0px solid ${color}`,
                    }}
                    className={`w-10 h-10 border-1 border-slate-400 ${
                      selectedColor === color ? "outline-8" : "outline-2"
                    } outline-double rounded-full`}
                  ></div>
                </span>
              ))}
            </p>
            <div className="flex items-center justify-end my-10">
              {/* {displayedId} */}
              {/* {selectedSize} */}

              {availableQuantity === 0 ? (
                <p className="text-red-500">غير متوفر</p>
              ) : (
                <>
                  <ButtonAddToFavourite
                    id={displayedId}
                    index={""}
                    updateParent={0}
                    size={selectedSize}
                  />

                  <ButtonAddToCart
                    id={displayedId}
                    index={""}
                    updateParent={updateCartLength}
                    size={selectedSize}
                  />
                </>
              )}
            </div>
            <div className=" w-[100%]">
              {selectedColor ? (
                <MoadelOrderProduct
                  nameUser={user}
                  idProduct={displayedId}
                  nameProduct={displayedName}
                  priceProduct={displayedPrice}
                  priceProductRealy={displayedPriceRealy}
                  gainProduct={displayedGain}
                  imageProduct={productImages}
                  sizeProduct={selectedSize}
                  storeProduct={availableStores}
                  amountProduct={availableQuantity}
                />
              ) : (
                <Button
                  disabled
                  className="w-[100%] opacity-50 bg-slate-800 rounded-2xl text-white text-center"
                >
                  أطلب الآن
                </Button>
              )}
            </div>
          </div>
          <div className="lg:flex md:flex sm:hidden max-sm:hidden h-auto w-auto flex justify-center p-6">
            <div className="w-96">
              <Slider {...settings}>
                {productImages &&
                  productImages.map((img, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center"
                    >
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="object-cover w-[100%]"
                      />
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </div>
        <div className="w-[90%] h-1 bg-[var(--mainColor)] my-6"></div>
        <div className=" w-[90%] flex flex-col items-end">
          <p className="p-4 bg-[var(--mainColor)] rounded-full rounded-es-none">
            تفاصيل أكثر عن المنتج
          </p>
          <p className="p-4 w-[100%] text-right">
            <p className="mb-2">{product.name}</p>
            <p style={{ direction: "rtl" }} className="mb-2">
              المقاس | {selectedSize}
            </p>
            <p style={{ direction: "rtl" }} className="mb-2">
              اللون | {selectedColor}
            </p>
            {/* <p> الكمية | {availableQuantity}</p> */}
          </p>
        </div>
        <div className="w-[90%] h-1 bg-[var(--mainColor)] my-6"></div>
      </>
    );
  };

  const GetProducts = async () => {
    setLoading(true);
    try {
      let response: { data: { token: string; product: any } };
      response = await axios.get(
        `${linkServer.link}products/getProduct/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setProduct(response.data.product);
      setDisplayedPrice(response.data.product.price2);
      setProductImages(response.data.product.image[0].image || []);
      setSelectedSize(
        (response.data.product.size && response.data.product.size[0]?.size) ||
          ""
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetProducts();
  }, []);

  useEffect(() => {
    selectedSize !== null && selectedColor !== null;
  });

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
                lengthProductsInFavourite={0}
              />
              <Body />
              <CartIcon
                userr={user}
                lengthProductsInCart={cartLength}
                lengthProductsInFavourite={0}
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
