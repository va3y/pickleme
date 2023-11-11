import { useMemo } from "react";
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const labels: Record<number, string> = {
  0: "driving",
  1: "indoor",
  2: "walking",
  3: "badposture",
  4: "goodposture",
  5: "meditation",
  6: "readfocused",
  7: "readonscreen",
  8: "readunfocused",
  9: "videoscreen",
};

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "ML Analysis",
    },
  },
};

export const MlResults: React.FC<{ input: number[] }> = (props) => {
  const res = useMemo(() => {
    return Object.entries(numberOfOccurances(props.input)).map(
      ([key, value]) => {
        const sum = Object.values(numberOfOccurances(props.input)).reduce(
          (acc, curr) => acc + curr,
          0,
        );
        return {
          label: labels[Number(key)],
          value: Math.round((value / sum) * 100),
        };
      },
    );
  }, [props.input]);
  return (
    <div className="mb-4">
      {/* {res.map((el) => (
        <div key={el.label}>
          {el.label}: {el.value}%
        </div>
      ))} */}
      <Bar
        options={options}
        data={{
          labels: res.map((el) => el.label),
          datasets: [
            {
              data: res.map((el) => el.value),
              backgroundColor: `rgba(0, 255, 255, 0.5)`,
            },
          ],
        }}
      />
    </div>
  );
};
function numberOfOccurances(arr: number[]) {
  const res: Record<number, number> = {};
  for (const el of arr) {
    if (res[el]) {
      res[el]++;
    } else res[el] = 1;
  }
  return res;
}
