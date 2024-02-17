import axios from "axios";
import React, { useEffect, useState } from "react";
import linkServer from "@/linkServer";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#00C49F", "pink"];

interface BestDelivery {
  name: string;
  ordersCount: number;
}

export default function Chart1_1() {
  const [bestDelivery, setBestDelivery] = useState<BestDelivery[]>([]);
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [loading, setLoading] = useState(true);

  const GetBestDelivery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${linkServer.link}analysis/getBestDelivery`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setBestDelivery(response.data.bestDelivery);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetBestDelivery();
  }, []);

  const data = bestDelivery.map((item) => ({
    name: item.name,
    uv: item.ordersCount,
    pv: 4000,
    amt: 200,
  }));

  const getPath = (x: any, y: any, width: any, height: any) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <>
      <p className="w-[100%] text-center mb-5">
        أكثر 5 مندوبين <span className="font-bold"> التوصيل </span> نشاطاَ
      </p>

      <BarChart
        width={450}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Bar
          dataKey="uv"
          fill="#8884d8"
          shape={<TriangleBar />}
          label={{ position: "top" }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
          ))}
        </Bar>
      </BarChart>
    </>
  );
}
