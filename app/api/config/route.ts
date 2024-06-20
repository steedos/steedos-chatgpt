import { NextRequest, NextResponse } from "next/server";
import { auth as nextAuth } from "@/auth"

import { getServerSideConfig } from "../../config/server";
import { DEFAULT_MODELS } from "@/app/constant";

const serverConfig = getServerSideConfig();

// Danger! Do not hard code any secret value here!
// 警告！不要在这里写入任何敏感信息！
const DANGER_CONFIG = {
  needCode: serverConfig.needCode,
  hideUserApiKey: serverConfig.hideUserApiKey,
  disableGPT4: serverConfig.disableGPT4,
  hideBalanceQuery: serverConfig.hideBalanceQuery,
  disableFastLink: serverConfig.disableFastLink,
  customModels: serverConfig.customModels,
  defaultModel: serverConfig.defaultModel,
};

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
}

async function handle(req: NextRequest) {
  const user =  (req as any).auth?.user;
  let customModels = "";
  // if (!user?.groups?.includes("chatgpt")) {
    customModels += DEFAULT_MODELS.filter((m) => m.name.startsWith("gpt-4"))
      .map((m) => "-" + m.name)
      .join(",");
  // }
  return NextResponse.json({
    ...DANGER_CONFIG,
    customModels 
  });
}

// export const GET = handle;
// export const POST = handle;
export const GET = nextAuth(function GET(req, params: any) {
  if (req.auth) return handle(req)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
export const POST = nextAuth(function POST(req, params: any) {
  if (req.auth) return handle(req)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})

export const runtime = "edge";
