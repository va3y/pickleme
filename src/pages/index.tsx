import Head from "next/head";
import Link from "next/link";

export default function Home() {
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
            <input type="file" />
          </label>
        </div>
      </main>
    </>
  );
}
