import { NextResponse } from "next/server";
import { decodeToken } from "@/utils/auth";
import cartModel from "@/models/cartModel";

export async function POST(req) {
  try {
    const userId = await decodeToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (productId === undefined) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productIdNumber = Number(productId);

    
    let cart = await cartModel.findOne({ userID: userId });

    // if (!cart) {
    //   cart = new cartModel({ userID: userId, items: [] });
    // }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productIdNumber
    );

    if (itemIndex > -1) {
      
      const result = await cartModel.findOneAndUpdate(
        { userID: userId, 'items.productId': productIdNumber },
        {
          $inc: { 'items.$.quantity': 1 }
        },
        { new: true, upsert: true } 
      );
    } else {
      cart.items.push({ productId: productIdNumber, quantity: 1 });
    }
    await cart.save();

    return NextResponse.json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
