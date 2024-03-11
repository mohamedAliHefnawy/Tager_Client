"use client";

// react
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

//component
import CartPos from "@/components/pos/cart";

//images
import Logo from "@/public/img/hbaieb.png";

//nextUi
import { Avatar } from "@nextui-org/react";

interface Product {
  _id: string;
  name: string;
  size: [{ size: string; store: [{ amount: number }] }];
  color: string;
  price3: number;
  image: string[];
  products: [
    {
      _id: string;
      name: string;
      image: string[];

      size: [{ size: string; store: [{ amount: number }] }];
      color: string;
      price1: string;
      price2: string;
      price3: number;
      catogry: string;
    }
  ];
  catogry: string;
}

export default function BodyPos({
  products,
  catogryFilter,
  searchTextFilt,
}: {
  products: Product[];
  catogryFilter: string;
  searchTextFilt: string;
}) {
  const [allProducts, setAllProducts] = useState<
    {
      idProduct: string;
      nameProduct: string;
      imageProduct: string[];
      sizeProduct: { size: string; store: { amount: number }[] }[];
      colorProduct: string;
      priceProduct: number;
      catogryProduct: string;
    }[]
  >([]);

  useEffect(() => {
    if (products) {
      const ProductsMain = products.map((item) => ({
        idProduct: item._id,
        nameProduct: item.name,
        imageProduct: [item.image[0]],
        sizeProduct: item.size,
        colorProduct: item.color,
        priceProduct: item.price3,
        catogryProduct: item.catogry,
      }));

      const ProductsFar3y = products.flatMap((item) =>
        item.products.map((item2) => ({
          idProduct: item2._id,
          imageProduct: [item2.image[0]],
          nameProduct: item2.name,
          sizeProduct: item2.size,
          colorProduct: item2.color,
          priceProduct: item2.price3,
          catogryProduct: item2.catogry,
        }))
      );

      setAllProducts([...ProductsMain, ...ProductsFar3y]);
    }
  }, [products]);

  const FilterProductsWithCatogry = allProducts.filter((item) => {
    const LowerCaseSearchText = searchTextFilt.toLocaleLowerCase();
    const matchesSearchText = item.nameProduct
      .toLowerCase()
      .includes(LowerCaseSearchText);
    const matchesCategory =
      !catogryFilter || item.catogryProduct === catogryFilter;
    return matchesSearchText && matchesCategory;
  });

  return (
    <>
      <div className="pt-1 grid lg:grid-cols-5 md:grid-cols-5 max-h-[100%] overflow-y-auto scrollDashbordPos rounded-se-2xl">
        {FilterProductsWithCatogry.length > 0 ? (
          FilterProductsWithCatogry.map((item, indexItem) => (
            <div
              className="flex items-center bg-warning-50 rounded-2xl p-3 mr-1 mb-1 hover:cursor-pointer transition-transform hover:scale-95"
              key={indexItem}
            >
              <div className="mr-3">
                <Avatar src={item.imageProduct[0]} alt="error" size="lg" />
              </div>
              <div>
                <p className="text-lg font-bold">{item.nameProduct}</p>
                <p className="flex">
                  <p className="mr-1">د.ل</p>
                  <p>{item.priceProduct}</p>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="w-[100%] p-10 flex justify-center">
            لا توجد نتائج للبحث
          </p>
        )}
      </div>
      <CartPos />
    </>
  );
}
