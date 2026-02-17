import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const store = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const NAME_MIN = 2;
const NAME_MAX = 30;
const NAME_REGEX = /^(?!\s*$).+/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 1000;

type Body = { name?: string; email?: string; message?: string; slug?: string; pageUrl?: string; honeypot?: string };

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.honeypot) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug : "";
  const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl : "";

  const errors: Record<string, string> = {};

  if (name.length < NAME_MIN || name.length > NAME_MAX || !NAME_REGEX.test(name)) {
    errors.name = "Name must be 2–30 characters and not only spaces.";
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    errors.message = "Message must be 5–1000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    // .env에서 따옴표 제거 및 공백 제거
    const notionKey = process.env.NOTION_KEY?.replace(/^["']|["']$/g, "").trim();
    const notionDatabaseId = process.env.NOTION_DATABASE_ID?.replace(/^["']|["']$/g, "").trim();

    if (!notionKey || !notionDatabaseId) {
      console.error("[Contact] Notion credentials not configured", {
        hasKey: !!notionKey,
        hasDbId: !!notionDatabaseId,
      });
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Notion API 클라이언트 (secret_ 또는 ntn_ 등 통합 토큰 형식 모두 허용)
    const notion = new Client({ auth: notionKey });

    // Notion 데이터베이스에 페이지 생성
    // 필드 매핑: Name -> 이름, Email -> 이메일, Message -> 메세지
    await notion.pages.create({
      parent: {
        database_id: notionDatabaseId,
      },
      properties: {
        이름: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        이메일: {
          email: email,
        },
        메세지: {
          rich_text: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
      },
    });

    console.log("[Contact] Saved to Notion", { slug, pageUrl, name, email });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[Contact] Notion API error:", error);
    
    // Notion API 에러 상세 정보 추출
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Notion API 에러 객체인 경우
      if ("code" in error) {
        const notionError = error as { code?: string; message?: string };
        if (notionError.code === "unauthorized" || errorMessage.includes("invalid")) {
          errorMessage = "API token is invalid. Please check your Notion integration token in .env file.";
        }
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
