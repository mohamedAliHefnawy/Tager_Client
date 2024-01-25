//react
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
//images
import Img from "@/public/img/bambooWatch.jpg";
import Img2 from "@/public/img/blue-t-shirt.jpg";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const productTemplate = () => {
    return (
      <div className="flex mx-auto">
        <Image src={Img} alt={"error"} className="w-[100%] h-60" />
      </div>
    );
  };

  return (
    <>
      <div className="w-[90%] mt-6">
        <Slider {...settings}>
          <div>{productTemplate()}</div>
          <div>{productTemplate()}</div>
          <div>{productTemplate()}</div>
        </Slider>
        <div className="w-[100%] max-lg:flex lg:flex md:flex sm:block max-sm:block justify-center mt-10">
          <Image
            src={Img}
            alt={"error"}
            className="w-[100%] h-60 max-lg:mr-1 lg:mr-1 md:mr-1 sm:mr-0 max-sm:mr-0"
          />
          <Image
            src={Img2}
            alt={"error"}
            className="w-[100%] h-60 max-lg:ml-1 lg:ml-1 md:ml-1 sm:ml-0 max-sm:ml-0"
          />
        </div>
      </div>
    </>
  );
}
