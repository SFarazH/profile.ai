import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import Cart from "@/models/cartModel";

export async function POST(req) {
  try {
    const userId = await decodeToken(req);
    console.log(userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
    }

    // Ensure items is an array
    const items = cart.items ?? [];

    // Check if the cart has items
    const existingItem = items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update the quantity if the product is already in the cart
      existingItem.quantity += 1;
    } else {
      // Add the new product to the cart
      items.push({ productId, quantity: 1 });
    }

    // Assign the updated items array back to the cart
    cart.items = items;

    // Save the cart instance
    await cart.save();

    return NextResponse.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
