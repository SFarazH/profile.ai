import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
