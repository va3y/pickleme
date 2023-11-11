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
  0: "Driving",
  1: "Indoor",
  2: "Walking",
  3: "Bad Posture",
  4: "Good Posture",
  5: "Meditation",
  6: "Focused reading",
  7: "Reading on screen",
  8: "Unfocused reading",
  9: "Watching video",
};

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  scales: {
    y: { ticks: { color: "rgb(229 231 235)", font: { size: 16 } } },
    x: { ticks: { color: "rgb(229 231 235)" } },
  },
  plugins: {
    legend: {
      display: false,
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
