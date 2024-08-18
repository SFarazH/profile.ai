import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import cartModel from "@/models/cartModel";

export async function GET(req) {
  try {
    const userId = await decodeToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await cartModel.findOne({ userID: userId });
    if (cart) {
      return NextResponse.json({ items: cart.items });
    } else {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
