import { parse } from "node-html-parser";

const baseUrl = "https://github.com/trending";

export const getTrendingData = async (programmingLang: string, period = "daily") => {
  const targetUrl = `${baseUrl}/${programmingLang === "all" ? "" : programmingLang}?since=${period}`;

  const html = await (await fetch(targetUrl)).text()
  const doc = parse(html)

  const repositories: unknown[] = []

  for (const item of doc.querySelectorAll("article[class=\"Box-row\"]")) {
    const repository = item.querySelector("h2")?.rawText.replace(/\s+/g, "");
    const description = item.querySelector("p")?.rawText.trim();
    const language = item.querySelector("span[itemprop=\"programmingLanguage\"]")?.rawText.trim() ?? "Unknown"
    const stars = parseInt(item.querySelector("a[href*=\"stargazers\"]")?.rawText.trim().replace(",", "") ?? "0")
    const forks = parseInt(item.querySelector("a[href*=\"forks\"]")?.rawText.trim().replace(",", "") ?? "0")
    const builtBy = item.querySelectorAll("a[data-hovercard-type=\"user\"]").map(
      user => user.attrs.href.replace("/", "@")
    )

    repositories.push({
      repository: repository,
      url: `https://github.com/${repository}`,
      description: description,
      language: language,
      stars: stars,
      forks: forks,
      builtBy: builtBy
    })
  }

  return repositories;
}
