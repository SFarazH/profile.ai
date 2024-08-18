import bcrypt from "bcrypt";
import userModel from "@/models/userModel";
import cartModel from "@/models/cartModel";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const register = async (req) => {
  await dbConnect();
  const { name, email, password } = req;

  if (!name || !email || !password) {
    return {
      success: false,
      message: "Enter all the details!",
      status: 400,
    };
  }

  try {
    const verifyEmail = await userModel.findOne({ email: email });
    if (verifyEmail) {
      return {
        success: false,
        message: "User already exists",
        status: 400,
      };
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

    return {
      success: true,
      message: "User created successfully",
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: 500,
    };
  }
};

export const login = async (req) => {
  const { email, password } = req;

  if (!email || !password) {
    return {
      success: false,
      message: "Enter all the details!",
      status: 400,
    };
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return {
        success: false,
        message: "Email not registered!",
        status: 401,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Incorrect Password!",
        status: 401,
      };
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return {
      success: true,
      message: "Login successful",
      token: jwtToken,
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: 500,
    };
  }
};

export const decodeToken = async (request) => {
  try {
    console.log("decoding....");
    const token = request.cookies.get("token")?.value || "";
    // console.log(token);
    if (!token) {
      throw new Error("Token not found");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decodedToken);
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    throw new Error(error.message); // Rethrow error to be caught in POST handler
  }
};

