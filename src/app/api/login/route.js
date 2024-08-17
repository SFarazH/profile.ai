import { login } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const { success, message, token, status } = await login({
      email,
      password,
    });

    const response = NextResponse.json({ success, message }, { status });

    if (success && token) {
      response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "Strict", // change to none if hosted
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
