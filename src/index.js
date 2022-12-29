const express = require("express")
const mongoose = require("mongoose")
const route = require("./route/route")
const multer = require("multer")
const app = express()

app.use(express.json())
app.use(multer().any())

mongoose.set('strictQuery', false)

mongoose.connect("mongodb+srv://vishal0102:vishal0102@cluster0.9uryho2.mongodb.net/Product_management", {
    useNewUrlParser: true
}).then(() => console.log("Mongoose Connected"))
    .catch((err) => console.log(err))

app.use("/", route)

app.listen(3000, () => {
    console.log("Server is running on ", 3000)
})