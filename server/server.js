import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./utils/db.js";
import AuthRoute from "./routes/Auth.routes.js"
import CouponRoute from "./routes/Coupon.routes.js"
import bodyParser from "body-parser";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000
app.use(cors({
    origin: 'https://internship-project-frontend-nnjp.onrender.com',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/auth", AuthRoute);
app.use("/api/coupon", CouponRoute);


app.listen(PORT, () => {
    connectDb();
    console.log(`server running at ${PORT}`)
})
