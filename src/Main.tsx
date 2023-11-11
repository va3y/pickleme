import dynamic from "next/dynamic";
import Head from "next/head";
import { ChangeEventHandler, useState } from "react";
import { STUB } from "~/stub";

export const ChartComponent = dynamic(() => import("~/Chart"), { ssr: false });
export type InputJson = {
  afe: { i: number[]; m: [number[]]; t: "L" | "R" }[];
  hearh: { hr: number };
}[];

// const URL = "http://127.0.0.1:5000/";
const URL = "https://flask-production-c507.up.railway.app";
const Page = () => {};

export default function MainPage() {
  const [inputJson, setInputJson] = useState<InputJson>(STUB as any);
  const [result, setResult] = useState();

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0] as File, "UTF-8");
    const json = await new Promise<InputJson>((res) => {
      fileReader.onload = (e) => {
        console.log("e.target.result", e.target?.result);
        if (e.target?.result) res(JSON.parse(e.target.result as string));
      };
    });
    setInputJson(json);

    const res = await (
      await fetch(URL, {
        body: JSON.stringify(json),
        method: "POST",
      })
    ).json();
  };
  return (
    <>
      <Head>
        <title>Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <h1>Junction Pixieray demo</h1>
        <div>
          <label>
            Input AFE file here
            <input onChange={onFileUpload} type="file" />
          </label>
        </div>
        {inputJson && (
          <div>
            <ChartComponent input={inputJson} />
          </div>
        )}
      </main>
    </>
  );
}
