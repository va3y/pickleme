const labels: Record<number, string> = {
  0: "walking",
  1: "driving",
  2: "indoor",
  3: "goodposture",
  4: "badposture",
  5: "meditation",
  6: "videoscreen",
  7: "readingscreen",
  8: "readingunfocus",
  9: "readingfocus",
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

export const MlResults: React.FC<{ input: number[] }> = (props) => {
  return (
    <div className="mb-4 w-max rounded bg-gray-100 p-4">
      <div className="mb-4 text-xl font-bold">Machine learning analysis</div>
      {Object.entries(numberOfOccurances(props.input)).map(([key, value]) => {
        return (
          <div key={key}>
            {labels[Number(key)]}: {value}
          </div>
        );
      })}
    </div>
  );
};
