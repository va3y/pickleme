import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { InputJson } from "./Main";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Timeline",
    },
  },
};

const Chart: React.FC<{ input: InputJson }> = (props) => {
  const [l, setL] = useState<number>(0);
  const data = useMemo(() => {
    return {
      labels: props.input.map((el) => el.afe[0]?.m[0][l]),
      datasets: [
        {
          label: "Dataset 1",
          data: props.input.map((el) => el.afe[0]?.m[0][l]),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }, [l, props.input]);

  return (
    <div>
      <label>
        L sensor:
        <select value={l} onChange={(e) => setL(Number(e.target.value))}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>
      </label>
      <Bar options={options} data={data} />
    </div>
  );
};

export default Chart;
