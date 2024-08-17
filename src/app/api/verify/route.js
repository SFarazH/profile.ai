import { decodeToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const userId = await decodeToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ userId, message: "User verified" });
  } catch (error) {
    console.error("Error in API:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
