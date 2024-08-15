import bcrypt from "bcrypt";
import userModel from "@/models/userModel";
import cartModel from "@/models/cartModel";
import { dbConnect } from "@/utils/dbConnect";

export const register = async (req, res) => {
  await dbConnect();
  const { name, email, password } = req;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Enter all the details!" });
  }

  try {
    const verifyEmail = await userModel.findOne({ email: email });
    if (verifyEmail) {
      return { message: "Email already registered!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const cart = new cartModel({
      userID: user._id,
      items: [],
      discount: 0,
    });

    await cart.save();

    return res.status(201).json({
      message: "User registered successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
