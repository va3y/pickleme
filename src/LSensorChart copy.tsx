import React, { useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { InputJson } from "./Main";
import { ChartJSOrUndefined } from "node_modules/react-chartjs-2/dist/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

export const LSensorChart: React.FC<{ input: InputJson }> = (props) => {
  const [l, setL] = useState<number>(0);

  const data = useMemo(() => {
    return {
      labels: props.input.map((el) => el.afe[0]?.m[0][l]),
      datasets: [
        {
          label: "L1",
          data: props.input.map((el) => el.afe[0]?.m[0][0]),
          borderColor: "rgba(255, 0, 0, 0.2)",
        },
        {
          label: "L2",
          data: props.input.map((el) => el.afe[0]?.m[0][1]),
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
        {
          label: "L3",
          data: props.input.map((el) => el.afe[0]?.m[0][2]),
          borderColor: "rgba(255, 0, 0, 0.7)",
        },
        {
          label: "L4",
          data: props.input.map((el) => el.afe[0]?.m[0][3]),
          borderColor: "rgba(0, 0, 255, 0.2)",
        },
        {
          label: "L5",
          data: props.input.map((el) => el.afe[0]?.m[0][4]),
          borderColor: "rgba(0, 0, 255, 0.5)",
        },
        {
          label: "L6",
          data: props.input.map((el) => el.afe[0]?.m[0][5]),
          borderColor: "rgba(0, 0, 255, 0.7)",
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
      <Line options={options} data={data} />
    </div>
  );
};
