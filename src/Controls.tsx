import { Controls } from "./Chart";

export function Controls(props: {
  controls: Partial<Controls>;
  setControls(set: (prev: Partial<Controls>) => Partial<Controls>): void;
}) {
  return (
    <div className="mb-8 w-max rounded bg-gray-100 p-4">
      <div className="mb-4 text-xl font-bold">Sensors</div>
      Left eye:
      <div className="flex gap-4 uppercase">
        {Array(5)
          .fill(null)
          .map((_el, i) => {
            const key = ("l" + (i + 1)) as "l1";
            return (
              <label key={key} className="flex gap-1">
                {key}
                <input
                  checked={props.controls?.leftEye?.[key]}
                  onChange={(e) => {
                    props.setControls((prev) => ({
                      ...prev,
                      leftEye: {
                        ...prev.leftEye,
                        [key]: !!e.target.checked,
                      } as any,
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
        <div className="flex gap-4 uppercase">
          {Array(5)
            .fill(null)
            .map((_el, i) => {
              const key = ("l" + (i + 1)) as "l1";
              return (
                <label key={key} className="flex gap-1">
                  {key}
                  <input
                    checked={props.controls?.rightEye?.[key]}
                    onChange={(e) =>
                      props.setControls((prev) => ({
                        ...prev,
                        rightEye: {
                          ...prev.rightEye,
                          [key]: !!e.target.checked,
                        } as any,
                      }))
                    }
                    type="checkbox"
                  />
                </label>
              );
            })}
        </div>
      </div>
      <label className="my-2 flex gap-2">
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
      <label className="flex gap-2">
        Temperature
        <input
          type="checkbox"
          checked={props.controls.temperature}
          onChange={(e) =>
            props.setControls((prev) => ({
              ...prev,
              temperature: !!e.target.checked,
            }))
          }
        />
      </label>
    </div>
  );
}
