import Link from "next/link";
import Image from "next/image";
import logofacebook from "@/public/img/facebook.png";
import logoyotube from "@/public/img/youtube.png";
import logoinsgram from "@/public/img/instagram.png";
import logolinkedin from "@/public/img/linkedin.png";

export default function Footer() {
  return (
    <>
      <div
        className="flex max-lg:flex lg:flex md:flex sm:block max-sm:block w-[100%] z-40 justify-between bg-[#0d1929] p-[100px] pt-[30px]"
        style={{ direction: "rtl" }}
      ></div>
      {/* <div
        className="flex max-lg:flex lg:flex md:flex sm:block max-sm:block w-[100%] z-40 justify-between bg-[#0d1929] p-[100px] pt-[30px]"
        style={{ direction: "rtl" }}
      >
        <div className=" max-lg:w-[60%] lg:w-[60%] md:w-[90%] sm:w-[90%] max-sm:w-[90%] text-left">
          <p style={{ color: "white", fontSize: "22px" }}>شركة الحبايب</p>
          <p style={{ color: "#B0ADAB", lineHeight: "42px" }}>
            منصة تتيح للتجار إدارة ومتابعة الطلبيات، اقتراح وتوفير مجموعة كبيرة
            من المنتجات، خدمات شحن للمنتجات وتوصيل للعميل النهائي والتحصيل منهم
          </p>

          <div className="bg-white opacity-10"></div>
          <br />

          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#cca330",
              fontSize: "20px",
            }}
          >
            الشروط والأحكام
          </Link>
          <p style={{ color: "#B0ADAB", lineHeight: "42px" }}>
            جميع الحقوق محفوظة لشركة الحبايب © 2023
          </p>
        </div>

        <div className="max-lg:w-[40%] lg:w-[40%] md:w-[90%] sm:w-[90%] max-lg:pr-[90px] lg:pr-[90px] md:pr-[90px] sm:pr-[0px] sm:mt-6 max-sm:w-[90%] max-sm:pr-[0px] max-sm:mt-6 text-left ">
          <p style={{ color: "#B0ADAB", fontSize: "18px" }}>
            تابعنا على مواقع التواصل الإجتماعي
          </p>
          <div className="flex justify-end my-6 py-3">
            <Link href="https://ar-ar.facebook.com/">
              {" "}
              <Image
                style={{ marginLeft: "10px" }}
                src={logofacebook}
                alt="error"
                width={35}
                height={35}
              />
            </Link>
            <Link href="https://ar-ar.facebook.com/">
              <Image
                style={{
                  backgroundColor: "#FF0000",
                  borderRadius: "50px",
                  marginLeft: "10px",
                }}
                src={logoyotube}
                alt="error"
                width={35}
                height={35}
              />
            </Link>
            <Link href="https://ar-ar.facebook.com/">
              <Image
                style={{ marginLeft: "10px" }}
                src={logoinsgram}
                alt="error"
                width={35}
                height={35}
              />
            </Link>
            <Link href="https://ar-ar.facebook.com/">
              <Image
                style={{ marginLeft: "10px" }}
                src={logolinkedin}
                alt="error"
                width={35}
                height={35}
              />
            </Link>
          </div>

          <p style={{ color: "#B0ADAB", fontSize: "16px", direction: "rtl" }}>
            البريد الإلكتروني |{" "}
            <Link style={{ textDecoration: "none", color: "#cca330" }} href="/">
              {" "}
              info@Elhbaieb.com{" "}
            </Link>{" "}
          </p>
        </div>
      </div> */}
    </>
  );
}
