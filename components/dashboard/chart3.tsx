import React, { useEffect, useState } from "react";
import axios from "axios";
import linkServer from "@/linkServer";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Avatar } from "@nextui-org/react";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#333"];

interface BestProducts {
  name: string;
  image: string;
  price1: number;
  numbersSells: number;
}

const Chart3 = () => {
  const [bestProducts, setBestProducts] = useState<BestProducts[]>([]);
  const secretKey = "#@6585c49f88fe0cd0da1359a7";
  const [loading, setLoading] = useState(true);

  const GetBestProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${linkServer.link}analysis/getBestProductsSelling`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      setBestProducts(response.data.top5Products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetBestProducts();
  }, []);

  const data = bestProducts.map((item) => ({
    name: item.name,
    value: item.numbersSells,
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${value}`}
      </text>
    );
  };

  const CustomTooltip = ({ payload, label, active }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p>{`${dataItem.name}: ${dataItem.value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <p className="w-[100%] text-center mb-5">
        أكثر 4  <span className="font-bold">منتجات</span> طلباَ
      </p>
      <div className="flex justify-between items-center">
        <div className="w-[40%] flex flex-col items-end">
          {bestProducts.map((item, indexItem) => (
            <div key={indexItem} className="flex items-center mb-2">
              <p className="mr-2">{item.name}</p>
              <Avatar src={`${item.image}`} size="md" />
            </div>
          ))}
        </div>
        <ResponsiveContainer width="50%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Chart3;
