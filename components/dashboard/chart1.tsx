import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import axios from "axios";
import linkServer from "@/linkServer";

export default function Chart1() {
  const secretKey = "#@6585c49f88fe0cd0da1359a7";

  const [bestProducts, setBestProducts] = useState([]);
  const [ordersPerMonth, setOrdersPerMonth] = useState([]);

  const GetBestProducts = async () => {
    try {
      const response = await axios.get(
        `${linkServer.link}analysis/getNumberOrdersInYear`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setOrdersPerMonth(response.data.ordersPerMonth);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetBestProducts();
  }, []);

  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const data = [
    { name: "", uv: 0, pv: 0, amt: 0 },
    ...arabicMonths.map((month) => ({
      name: month,
      pv:
        ordersPerMonth[
          `${
            arabicMonths.indexOf(month) + 1
          }/${new Date().getFullYear()}` as keyof typeof ordersPerMonth
        ] || 0,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" className="mt-4">
          <Label position="insideBottom" offset={-10} fill="#666" />
        </XAxis>
        <YAxis className="mt-3" />
        <Line
          type="monotoneX"
          dataKey="pv"
          stroke="var(--mainColor)"
          strokeWidth={2}
        />

        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
