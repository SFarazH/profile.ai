import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import Cart from "@/models/cartModel";

export async function GET(req) {
  try {
    const userId = await decodeToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      return NextResponse.json({ totalItems: 0 });
    }

    // Calculate the total number of items
    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    console.log(totalItems);

    return NextResponse.json({ totalItems });
  } catch (error) { 
    console.error("Error fetching total items in cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
