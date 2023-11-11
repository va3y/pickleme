import React, { ComponentProps, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { InputJson } from "./Main";
import { Controls } from "./Controls";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type EyeData = {
  l1: boolean;
  l2: boolean;
  l3: boolean;
  l4: boolean;
  l5: boolean;
  l6: boolean;
};

export type Controls = {
  leftEye: EyeData;
  rightEye: EyeData;
  ambientLight: boolean;
  temperature: boolean;
};

export const LSensorChart: React.FC<{ input: InputJson }> = (props) => {
  const [controls, setControls] = useState<Partial<Controls>>({
    temperature: true,
  });

  const data = useMemo<
    ChartData<"line", (number | undefined)[], string>
  >(() => {
    return {
      labels: props.input.map((el) =>
        new Date((el.afe[0]?.i[1] as number) / 100).toLocaleTimeString(),
      ),
      datasets: [
        ...(controls.ambientLight
          ? [
              {
                label: "Ambient light",
                borderColor: `rgba(0, 255, 0, 1)`,
                data: props.input.map((el) => {
                  return el.auxSensors.lightAmbient.v[2];
                }),
              },
            ]
          : []),
        ...(controls.temperature
          ? [
              {
                label: "Temperature",
                borderColor: `rgba(0, 255, 255, 0.5)`,
                data: props.input.map((el) => {
                  return el.auxSensors.tempEt.v[0];
                }),
              },
            ]
          : []),
        ...Object.entries(controls.leftEye ?? {})
          .filter(([key, value]) => value)
          .map(([key]) => {
            const count = Number(key.slice(1));
            return {
              label: "left " + key.toUpperCase(),
              data: props.input.map(
                (el) => el.afe[0]?.m[0][Number(key.slice(1)) - 1],
              ),
              borderColor: `rgba(255, 0, 0, ${0.15 * count})`,
            };
          }),
        ...Object.entries(controls.rightEye ?? {})
          .filter(([key, value]) => value)
          .map(([key]) => {
            const count = Number(key.slice(1));
            return {
              label: "right " + key.toUpperCase(),
              data: props.input.map(
                (el) => el.afe[1]?.m[0][Number(key.slice(1)) - 1],
              ),
              borderColor: `rgba(0, 0, 255, ${0.15 * count})`,
            };
          }),
      ],
    };
  }, [props.input, controls]);

  const options = useMemo<ComponentProps<typeof Line>["options"]>(() => {
    return {
      responsive: true,
      elements: { point: { radius: 0 } },
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: props.input.find((el) => el.labels)?.labels?.join(", "),
        },
      },
    };
  }, [props.input]);

  return (
    <div>
      <Controls controls={controls} setControls={setControls} />
      <Line options={options} data={data} />
    </div>
  );
};
