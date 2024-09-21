import express from "express"
import dotenv from "dotenv"
// import cors from 'cors'
dotenv.config()
import cookieParser from "cookie-parser"
import {connectDB}  from "./db/connectDB.js"
import { userRouter } from "./routes/userRoute.js"


const port = process.env.PORT || 3001
const app = express()
app.use(express.json())
app.use(cookieParser())
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL, // Restrict CORS to your frontend URL
//     credentials: true,
//   })
// );



// handling uncaught expression
process.on("uncaughtException", err => {
    console.log(`uncaughtException error is: ${err.message}`);
    process.exit(1)
});


// root routes
app.get("/", (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message:"Server running..."
        })
    } catch (error) {
        console.log(`server break error: ${error.message}`);
        res.status(400).json({
            success: false,
            message:"Oops! Server can't run. Check console for the error"
        })
    }
})


app.use("/api/auth", userRouter)


//listening server
const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port: http://localhost:${port}`)
    connectDB();
})

//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`unhandled Rejection error: ${err.message}`);
    console.log(`Shuting down the server due to unhandled promise rejection!`);
    server.close(() => {
        process.exit(1)
    })
});