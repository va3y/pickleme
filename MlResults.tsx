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
import { ML_STUB } from "~/mlStub";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const labels: Record<number, string> = {
  0: "Walking",
  1: "Driving",
  2: "Indoor",
  3: "Good posture",
  4: "Bad posture",
  5: "Meditation",
  6: "Video screen",
  7: "Reading screen",
  8: "Reading unfocused",
  9: "Reading focused",
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
    title: {
      display: true,
      text: "ML Analysis",
    },
  },
};

export const MlResults: React.FC<{ input: number[] }> = (props) => {
  const res = useMemo(() => {
    return Object.entries(numberOfOccurances(ML_STUB)).map(([key, value]) => {
      const sum = Object.values(numberOfOccurances(ML_STUB)).reduce(
        (acc, curr) => acc + curr,
        0,
      );
      return {
        label: labels[Number(key)],
        value: Math.round((value / sum) * 100),
      };
    });
  }, [props.input]);
  return (
    <div className="mb-4 max-w-[700px] rounded bg-gray-100 p-4">
      <div className="mb-4 text-xl font-bold">Machine learning analysis</div>
      {/* {res.map((el) => (
        <div key={el.label}>
          {el.label}: {el.value}%
        </div>
      ))} */}
      <Bar
        options={options}
        data={{
          labels: res.map((el) => el.label),
          datasets: [{ data: res.map((el) => el.value) }],
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
