import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const REPO = process.env.GITHUB_REPO || "Ai-Bock-AT/ai-bock-cloud";
const BRANCH = process.env.GITHUB_BRANCH || "main";

const [owner, repo] = REPO.split("/");

export async function getFile(path: string): Promise<string> {
  const res = await octokit.repos.getContent({ owner, repo, path, ref: BRANCH });
  const data = res.data as { type: string; encoding: string; content: string };
  if (data.type !== "file") throw new Error(`${path} is not a file`);
  return Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf-8");
}

export interface GitHubEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
}

export async function listDir(path: string): Promise<GitHubEntry[]> {
  try {
    const res = await octokit.repos.getContent({ owner, repo, path, ref: BRANCH });
    const data = res.data as Array<{ name: string; path: string; type: string; sha: string }>;
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      name: d.name,
      path: d.path,
      type: d.type as "file" | "dir",
      sha: d.sha,
    }));
  } catch {
    return [];
  }
}

export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: BRANCH,
  });
}

export async function updateFile(
  path: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    sha,
    branch: BRANCH,
  });
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  await octokit.repos.deleteFile({ owner, repo, path, message, sha, branch: BRANCH });
}
