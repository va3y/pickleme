import React, { ComponentProps, useMemo, useRef, useState } from "react";
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
  ChartData,
  CoreChartOptions,
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

type EyeData = {
  l1: boolean;
  l2: boolean;
  l3: boolean;
  l4: boolean;
  l5: boolean;
  l6: boolean;
};

type Controls = { leftEye: EyeData; rightEye: EyeData; ambientLight: boolean };

export const LSensorChart: React.FC<{ input: InputJson }> = (props) => {
  const [controls, setControls] = useState<Partial<Controls>>({});

  const data = useMemo<
    ChartData<"line", (number | undefined)[], string>
  >(() => {
    return {
      labels: props.input.map((el) =>
        new Date((el.afe[0]?.i[1] as number) / 100).toLocaleTimeString(),
      ),
      datasets: [
        ...(controls.ambientLight
          ? ([
              {
                label: "Ambient light",
                borderColor: `rgba(0, 255, 0, 1)`,
                data: props.input.map((el) => {
                  console.log(22, el.auxSensors.lightAmbient.v[2]);
                  return el.auxSensors.lightAmbient.v[2];
                }),
              },
            ] as const)
          : ([] as const)),
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
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
        },
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

function Controls(props: {
  controls: Partial<Controls>;
  setControls(set: (prev: Partial<Controls>) => Partial<Controls>): void;
}) {
  return (
    <div>
      Left eye:
      <div>
        {Array(5)
          .fill(null)
          .map((el, i) => {
            const key = ("l" + (i + 1)) as "l1";
            return (
              <label key={key}>
                {key}
                <input
                  checked={props.controls?.leftEye?.[key]}
                  onChange={(e) => {
                    console.log(e.target.checked);
                    props.setControls((prev) => ({
                      ...prev,
                      leftEye: { ...prev.leftEye, [key]: !!e.target.checked },
                    }));
                  }}
                  type="checkbox"
                />
              </label>
            );
          })}
      </div>
      <div>
        Right eye:
        <div>
          {Array(5)
            .fill(null)
            .map((el, i) => {
              const key = ("l" + (i + 1)) as "l1";
              return (
                <label key={key}>
                  {key}
                  <input
                    checked={props.controls?.rightEye?.[key]}
                    onChange={(e) =>
                      props.setControls((prev) => ({
                        ...prev,
                        rightEye: {
                          ...prev.rightEye,
                          [key]: !!e.target.checked,
                        },
                      }))
                    }
                    type="checkbox"
                  />
                </label>
              );
            })}
        </div>
      </div>
      <div>
        <label>
          Ambient light
          <input
            type="checkbox"
            checked={props.controls.ambientLight}
            onChange={(e) =>
              props.setControls((prev) => ({
                ...prev,
                ambientLight: !!e.target.checked,
              }))
            }
          />
        </label>
      </div>
    </div>
  );
}
