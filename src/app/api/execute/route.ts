// src/app/api/execute/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runJavascript } from "@/lib/execution/javascriptRunner";
import type { ExecutionResult } from "@/lib/types";

type SupportedLanguage = "javascript" | "python";

type ExecuteRequestBody = {
  language: SupportedLanguage;
  code: string;
  algoId?: string | null;
  input?: unknown;
  options?: {
    captureTrace?: boolean;
  };
};

type ExecuteResponseBody =
  | {
      ok: true;
      language: SupportedLanguage;
      algoId?: string | null;
      result: ExecutionResult;
      warnings?: string[];
    }
  | {
      ok: false;
      error: string;
      details?: unknown;
    };

function jsonError(
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ExecuteResponseBody> {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details,
    },
    { status }
  );
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ExecuteResponseBody>> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return jsonError("Request body must be a JSON object.", 400);
  }

  const {
    language,
    code,
    algoId,
    input,
    options,
  } = body as Partial<ExecuteRequestBody>;

  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Field 'code' is required and must be a non-empty string.");
  }

  if (!language || (language !== "javascript" && language !== "python")) {
    return jsonError(
      "Field 'language' must be either 'javascript' or 'python'."
    );
  }

  // For now only JavaScript is fully supported in the backend.
  // Python calls return a structured error so the UI can show it.
  if (language === "python") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Python execution is not implemented in this demo backend yet. " +
          "You can still use the Playground to edit Python templates.",
        details: { language, algoId, hasInput: typeof input !== "undefined" },
      },
      { status: 200 }
    );
  }

  const warnings: string[] = [];

  if (options && options.captureTrace === false) {
    warnings.push(
      "captureTrace=false is currently ignored; trace generation is controlled by algoId."
    );
  }

  const normalizedAlgoId = algoId ?? undefined;

  try {
    const result = await runJavascript(code, normalizedAlgoId);

    return NextResponse.json(
      {
        ok: true,
        language,
        algoId: normalizedAlgoId,
        result,
        warnings: warnings.length > 0 ? warnings : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error while executing code.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        details: {
          language,
          algoId: normalizedAlgoId,
          // never echo the code back in the error for safety
        },
      },
      { status: 500 }
    );
  }
}
