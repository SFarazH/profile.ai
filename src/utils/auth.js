import bcrypt from "bcrypt";
import userModel from "@/models/userModel";
import cartModel from "@/models/cartModel";
import { dbConnect } from "@/utils/dbConnect";
import { NextResponse } from "next/server";

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

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true, // for production
      maxAge: 4 * 60 * 60 * 1000,
    });

    // res.header("Access-Control-Allow-Credentials", "true");
    console.log("cookie sent", jwtToken);

    return response;
  } catch (error) {
    return { error: error.message, status: 500 };
  }
};
