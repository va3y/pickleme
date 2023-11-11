import { MlResults } from "~/MlResults";
import Head from "next/head";
import { ChangeEventHandler, useState } from "react";
import { LSensorChart } from "~/Chart";
import { STUB } from "~/stub";

import { Press_Start_2P } from "next/font/google";
import { Spinner } from "./Spinner";

const titleFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
});

export type InputJson = {
  afe: { i: number[]; m: [number[]]; t: "L" | "R" }[];
  heart?: { hr: number };
  labels?: string[];
  auxSensors: {
    lightAmbient: {
      v: [
        number, // UV 1
        number, // UV 2
        number, // Ambient light
        number, // IR 0
      ];
    };
    tempEt: {
      v: [number]; // This is only the first left eye sensor, but whatever
    };
  };
}[];

// const URL = "http://127.0.0.1:5000/";
const URL = "https://flask-production-c507.up.railway.app";

export default function MainPage() {
  const [inputJson, setInputJson] = useState<InputJson>(STUB as any);
  const [serverResponse, setServerResponse] = useState();
  const [loading, setLoading] = useState(false);

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setLoading(true);
    setServerResponse(undefined);
    if (!e.target.files?.length) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0] as File, "UTF-8");
    const json = await new Promise<InputJson>((res) => {
      fileReader.onload = (e) => {
        if (e.target?.result) res(JSON.parse(e.target.result as string));
      };
    });
    setInputJson(json);

    const res = await (
      await fetch(URL, {
        body: JSON.stringify(json),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      })
    ).json();

    setServerResponse(res);
    setLoading(false);
  };
  return (
    <>
      <Head>
        <title>Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-8 font-sans">
        <h1
          className={`mb-8 ${titleFont.className} font-sans text-8xl font-bold`}
        >
          Cognitive Tracker
        </h1>
        <label className="mb-6 block">
          <div className="block">Upload the AFE file here:</div>
          <input className="block" onChange={onFileUpload} type="file" />
        </label>
        <div className="gap grid grid-cols-2 gap-6 ">
          <div className="rounded-lg bg-gray-800 p-6">
            <div className="mb-4 text-4xl font-bold">Sensors</div>
            {inputJson && <LSensorChart input={inputJson} />}
          </div>
          <div className="relative mb-4 h-full max-w-[700px] rounded-lg bg-gray-800 p-6">
            <div className="mb-4 text-4xl font-bold capitalize">
              Machine learning analysis
            </div>
            {serverResponse && <MlResults input={serverResponse} />}
            {loading && <Spinner />}
          </div>
        </div>
      </main>
    </>
  );
}
