import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import cartModel from "@/models/cartModel";

export async function POST(req) {
  try {
    const userId = await decodeToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, action } = await req.json();
    if (productId === undefined) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productIdNumber = Number(productId);
    let cart = await cartModel.findOne({ userID: userId });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productIdNumber
    );

    if (itemIndex > -1) {
      if (action === "increment") {
        await cartModel.findOneAndUpdate(
          { userID: userId, "items.productId": productIdNumber },
          {
            $inc: { "items.$.quantity": 1 },
          },
          { new: true, upsert: true }
        );
      } else if (action === "decrement" && cart.items[itemIndex].quantity > 1) {
        await cartModel.findOneAndUpdate(
          { userID: userId, "items.productId": productIdNumber },
          {
            $inc: { "items.$.quantity": -1 },
          },
          { new: true, upsert: true }
        );
      } else if (action === "decrement" && cart.items[itemIndex].quantity === 1) {
        cart.items.splice(itemIndex, 1); // Remove the item if quantity is 1 and action is decrement
      }
    } else {
      if (action === "increment") {
        cart.items.push({ productId: productIdNumber, quantity: 1 });
      }
    }

    await cart.save();
    return NextResponse.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
