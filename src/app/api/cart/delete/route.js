import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import cartModel from "@/models/cartModel";

export async function DELETE(req) {
  try {
    
    const userId = await decodeToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract the productId from the request body
    const { productId } = await req.json();
    if (productId === undefined) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productIdNumber = Number(productId);

    // Find the user's cart and remove the item with the specified productId
    const result = await cartModel.findOneAndUpdate(
      { userID: userId },
      {
        $pull: { items: { productId: productIdNumber } },
      },
      { new: true } // Return the updated document
    );

    if (!result) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from cart", cart: result });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
