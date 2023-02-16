import { Head } from "$fresh/runtime.ts";
import AppBar from "../components/AppBar.tsx";
import IoSection from "../islands/IoSection.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Vercel Repo Finder</title>
      </Head>
      <AppBar />
      <h1 class="flex justify-center text-2xl pt-12 pb-6">Find public GitHub repositories with <b>&nbsp;*.vercel.app&nbsp;</b> URLs</h1>
      <IoSection />
    </>
  );
}
