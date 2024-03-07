//react
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
//images
import Img from "@/public/img/bambooWatch.jpg";
import Img2 from "@/public/img/blue-t-shirt.jpg";
import Img3 from "@/public/img/bg.png";
import Img4 from "@/public/img/bg-2222.png";
import Img5 from "@/public/img/bg-3333.png";

export default function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    <Image src={Img2} alt={"error"} className="w-[100%] h-60" />,
    <Image src={Img3} alt={"error"} className="w-[100%] h-60" />,
    <Image src={Img4} alt={"error"} className="w-[100%] h-60" />,
    <Image src={Img5} alt={"error"} className="w-[100%] h-60" />,
  ];
  const productTemplate = () => {
    return (
      <div className="flex mx-auto">
        <Image src={Img3} alt={"error"} className="w-[100%] h-60" />
      </div>
    );
  };
  const productTemplate2 = () => {
    return (
      <div className="flex mx-auto">
        <Image src={Img4} alt={"error"} className="w-[100%] h-60" />
      </div>
    );
  };
  const productTemplate3 = () => {
    return (
      <div className="flex mx-auto">
        <Image src={Img5} alt={"error"} className="w-[100%] h-60" />
      </div>
    );
  };

  return (
    <>
      <div className="w-[90%] mt-6">
        <Slider autoplay {...settings}>
          <div>{productTemplate()}</div>
          <div>{productTemplate2()}</div>
          <div>{productTemplate3()}</div>
        </Slider>
        <div className="w-[100%] max-lg:flex lg:flex md:flex sm:block max-sm:block justify-center mt-10">
          <Image
            src={Img3}
            alt={"error"}
            className="w-[90%] h-60 max-lg:mr-1 lg:mr-1 md:mr-1 sm:mr-0 max-sm:mr-0"
          />
          <Image
            src={Img2}
            alt={"error"}
            className="w-[90%] h-60 max-lg:ml-1 lg:ml-1 md:ml-1 sm:ml-0 max-sm:ml-0"
          />
        </div>
      </div>
    </>
  );
}
