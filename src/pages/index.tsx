import Head from "next/head";
import Link from "next/link";
import { ChangeEventHandler, useState } from "react";

type InputJson = {
  afe: { i: number[]; m: number[]; t: "L" | "R" }[];
  hearh: { hr: number };
}[];

export default function Home() {
  const [inputJson, setInputJson] = useState<InputJson>();
  const [result, setResult] = useState();

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0] as File, "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target?.result);
      setInputJson(JSON.parse(e.target?.result as string));
    };

    const res = await (
      await fetch("https://flask-production-c507.up.railway.app")
    ).json();
  };
  return (
    <>
      <Head>
        <title>Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div>
          <label>
            Input
            <input onChange={onFileUpload} type="file" />
          </label>
        </div>
        {inputJson && <div>Result JSON: {JSON.stringify(inputJson)}</div>}
      </main>
    </>
  );
}
