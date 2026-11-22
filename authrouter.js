import express from "express";
import joi from "joi";
import ChatUser from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authmiddlewear } from "./authmiddlewear.js";

const router = express.Router();



const registerSchema = joi.object({
    name: joi.string().min(3).max(15).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
})

router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                message: "All fields are required",
                data: null,
                code: 400
            })
        }

        let validation = registerSchema.validate(req.body);
        console.log(validation);


        let finduser = await ChatUser.findOne({ email: email });
        if (finduser) {
            return res.status(400).json({
                message: "User already exists",
                data: null,
                code: 400
            })
        }

        let saltround = 13;
        let hashedpassword = await bcrypt.hash(password, saltround);
        console.log(hashedpassword);

        let { password: userpass, ...remainuserdata } = req.body;


        // let userid = new Date().getTime() + Math.floor(Math.random() * 1000);

        let newuser = new ChatUser({
            ...remainuserdata,
            // id: userid,
            password: hashedpassword,
        })


        let token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token);

        await newuser.save();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000
        });


        return res.status(200).json({
            message: "User registered successfully",
            data: newuser,
            token: token,
            code: 200
        })


    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })

    }
});


router.post("/Login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password || email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                message: "All fields are required",
                data: null,
                code: 400
            })
        }

        let validation = loginSchema.validate(req.body);
        console.log(validation);

        let finduser = await ChatUser.findOne({ email: email });
        if (!finduser) {
            return res.status(400).json({
                message: "User not found",
                data: null,
                code: 400
            })
        }

        let isMatch = await bcrypt.compare(password, finduser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                data: null,
                code: 400
            })
        }

        let token = jwt.sign({ id: finduser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "User logged in successfully",
            data: finduser,
            token: token,
            code: 200
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })
    }
})


router.get("/dashboard", authmiddlewear, async (req, res) => {
    try {
        let authuser = req.user.id;
        let finduser = await ChatUser.findOne({ _id: authuser })

        res.status(200).json({
            message: "Welcome to dashboard",
            data: finduser,
            code: 200
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })
    }
})

router.post("/logout", authmiddlewear, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "user logged out successfully",
            data: null,
            code: 200
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })
    }
})

router.delete("/deleteuser", authmiddlewear, async (req, res) => {
    try {
        let authuser = req.user.id;
        console.log(authuser);

        let deleteuser = await ChatUser.findOneAndDelete({ _id: authuser })

        if (!deleteuser) {
            return res.status(400).json({
                message: "User not found",
                data: null,
                code: 400
            })
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "user successfully deleted account",
            data: null,
            code: 200
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })
    }
})



export default router;