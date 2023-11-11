import { MlResults } from "MlResults";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ChangeEventHandler, useState } from "react";
import { LSensorChart } from "~/Chart";
import { STUB } from "~/stub";

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
        headers: {
          "Content-type": "application/json",
        },
      })
    ).json();

    setServerResponse(res);
  };
  return (
    <>
      <Head>
        <title>Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 font-sans">
        {serverResponse && <MlResults input={serverResponse} />}

        <h1 className="mb-4 font-sans text-xl font-bold">AFE File viewer</h1>
        <label className="mb-4 block">
          <div className="block">Your file:</div>
          <input className="block" onChange={onFileUpload} type="file" />
        </label>
        {inputJson && (
          <div>
            <LSensorChart input={inputJson} />
          </div>
        )}
      </main>
    </>
  );
}
