const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const orderController = require("../controllers/orderController")
const cartController = require("../controllers/cartController")
const auth = require("../middleware/auth")

//------------------------- User Controller APIs ------------------------//
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/user/:userId/profile", auth.authentication, auth.authorisation, userController.getUser)
router.put("/user/:userId/profile", auth.authentication, auth.authorisation, userController.updateUser)

//------------------------- Product Controller APIs ------------------------//
router.post("/products", productController.createproduct)
router.get("/products", productController.getProduct)
router.get("/products/:productId", productController.getProductById)
router.put("/products/:productId", productController.updateProduct)
router.delete("/products/:productId", productController.deleteProduct)

//-------------------------Cart Controller APIs------------------------//
router.post("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.createCart)
router.get("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.getCart)
router.put("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.updateCart)
router.delete("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.deleteCart)

//-------------------------Order Controller APIs------------------------//
router.post("/users/:userId/orders", auth.authentication, auth.authorisation, orderController.createOrder)
router.put("/users/:userId/orders", auth.authentication, auth.authorisation, orderController.updateOrder)

//--------------------------------------------------------------------------//

router.all("/**", (req, res)=>{
    res.status(400).send({status:false, message:"path not found"})
})
module.exports = router