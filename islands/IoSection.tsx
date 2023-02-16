import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime";

/**
 * Selected details of a GitHub repo.
 */
export interface Repo {
  fullName: string;
  homepage: string;
}

export default function IoSection(props: JSX.HTMLAttributes<HTMLInputElement>) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [input, setInput] = useState("");

  // simple URL validator
  const regex = new RegExp("(?:https:\/\/)?[a-zA-Z]+[a-zA-Z0-9]*\.vercel\.app[\/]?$");

  return (
    <div class='flex flex-col justify-center items-center'>
      <div class="flex flex-row justify-center">
        <input
          {...props}
          placeholder="Vercel homepage URL"
          disabled={!IS_BROWSER}
          class="min-w-[20%] px-3 py-2 bg-white rounded border(black 2) disabled:(opacity-50 cursor-not-allowed) mx-2"
          onChange={(e) => {
            const target = e.target as HTMLTextAreaElement;
            console.info(target?.value);
            setInput(target?.value);
          }}
        />
        <button
          class={`px-3 py-2 ${regex.test(input) ? "bg-yellow-200 hover:bg-yellow-300" : "bg-gray-200" } text-yellow-800 rounded`}
          disabled={ !regex.test(input) }
          onClick={ async () => {
            let inputUrl = input;
            if(inputUrl.substring(0, 8) === "https://")
              inputUrl = inputUrl.substring(8);
            inputUrl = inputUrl.replace("/", "");

            const subdomain = inputUrl.split(".")[0];
            const url = `https://api.github.com/search/repositories?q=${subdomain}%20in:name&per_page=100`;
            const githubSearchRes = await fetch(url);

            if(githubSearchRes.status == 200) {
              const githubSearch = await githubSearchRes.json();
              const reps = githubSearch.items;
              const repoList: Repo[] = [];
              reps.forEach((repo: any) => {
                // find repos with a matching homepage
                if(repo.homepage && repo.homepage.includes(subdomain) && repo.homepage.includes(".vercel.app"))
                  repoList.push({fullName: repo.full_name, homepage: repo.homepage} as Repo);
              });

              setRepos(repoList);
            }
          }}  
        >
          Search
        </button>
      </div>
      <button class='flex flex-col pt-6 items-center'>
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </button>
      
      <div class={`flex flex-col items-center justify-center py-4 ${repos.length === 0 ? 'invisible' : 'visible'}`}>
        <h2 class='justify-center text-2xl py-6'>Repos which could be what you're looking for:</h2>
        <table class='border(black 1)'>
          <tr class='text-2xl rounded'>
            <th class='p-2 border(black 1)'>Repo</th>
            <th class='p-2 border(black 1)'>Points to</th>
          </tr>
          {repos.map(repo => (
            <tr class='justify-center items-center'>
              <td class='py-2 px-4 border(black 1) justify-center items-center'>
                <a href={`https://github.com/${repo.fullName}`}
                  class='text-blue-500 hover:text-blue-600'
                >
                  {repo.fullName}
                </a>
              </td>
              <td class='py-2 px-4 border(black 1) justify-center items-center'>
                <a href={repo.homepage.includes('https://') ? repo.homepage : `https://${repo.homepage}`}
                  class='text-blue-500 hover:text-blue-600 '
                >
                  {repo.homepage.includes('https://') ? repo.homepage : `https://${repo.homepage}`}
                </a>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
