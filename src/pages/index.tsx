import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../Main"), {
  ssr: false,
});

export default () => <DynamicComponentWithNoSSR />;
