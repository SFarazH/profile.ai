import { NextResponse } from "next/server";
import { register } from "@/utils/register";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const response = await register({ name, email, password });

    return NextResponse.json(response);
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
