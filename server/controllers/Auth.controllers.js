import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.models.js"

export const registerAdmin = async (req,res) => {
    const {username, email, password} = req.body;
    try {
        const findUser = await User.findOne({ username });
        if (findUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }
        const hashPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashPassword
        })
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successfull"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exists! Register first"
            })
        }
        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            username: checkUser.username
        },
            process.env.CLIENT_SECRET,
            { expiresIn: "10m" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                id: checkUser._id,
                username: checkUser.username
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const logoutAdmin = async (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
    });
}