import { MlResults } from "~/MlResults";
import Head from "next/head";
import { ChangeEventHandler, useState } from "react";
import { LSensorChart } from "~/Chart";
import { STUB } from "~/stub";

import { Press_Start_2P } from "next/font/google";
import { Spinner } from "./Spinner";
import { z } from "zod";
import Link from "next/link";

const titleFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
});

export type InputJson = {
  afe: { i: number[]; m: number[][]; t: "L" | "R" | string }[];
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

const vagueAfeFileSchema = z
  .object({
    afe: z.object({}).array(),
    auxSensors: z.object({}),
  })
  .array();

export default function MainPage() {
  const [inputJson, setInputJson] = useState<InputJson>(STUB as any);
  const [serverResponse, setServerResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setError("");
    if (!e.target.files?.[0]) return;
    let json: InputJson;
    try {
      json = await parseJSONFromFile(e.target.files[0]);
    } catch (error) {
      return setError("Invalid file format");
    }
    console.log(vagueAfeFileSchema.safeParse(json.slice(0, 5)));

    if (!vagueAfeFileSchema.safeParse(json.slice(0, 5)).success)
      return setError("Invalid file format");

    setLoading(true);
    setServerResponse(undefined);
    setInputJson(json);

    try {
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
    } catch (error) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative p-8 font-sans">
        <h1
          className={`mb-8 ${titleFont.className} font-sans text-8xl font-bold`}
        >
          Cognitive Tracker
        </h1>
        <label className="mb-6 block">
          <div className="block">Upload the AFE file here:</div>
          <input className="block" onChange={onFileUpload} type="file" />
          {error && <div className="mt-2 text-red-500">{error}</div>}
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
        <Link
          href="https://github.com/va3y/pickleme"
          className="absolute right-8 top-8 font-semibold"
        >
          GitHub source
        </Link>
      </main>
    </>
  );
}

async function parseJSONFromFile(file: File) {
  const fileReader = new FileReader();

  fileReader.readAsText(file, "UTF-8");
  const json = await new Promise<InputJson>((res) => {
    fileReader.onload = (e) => {
      if (e.target?.result) res(JSON.parse(e.target.result as string));
    };
  });
  return json;
}
