import express from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controllers/Auth.controllers.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
// router.get("/checkAuth",authMiddleware, (req,res) => {
//     const user = req.user;
//     res.status(200).json({
//         success: true,
//         message: "Authenticated user!",
//         user,
//     });
// })

export default router;