const { isValidObjectId } = require("mongoose")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")

//=============================== crete cart api ======================================================
const createCart = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: " Please enter productId or cartId !" }); }
        let user = req.userByUserId
        data.userId = user._id
        let { productId } = data

        if (!productId) { return res.status(400).send({ status: false, message: "ProductId is mandatory !" }) }
        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: "Please enter valid productId !" }) };
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) { return res.status(404).send({ status: false, message: "No such product found !" }); }

        let cart = await cartModel.findOne({ userId: user._id })

        if (!cart) {
            let arr = [{
                productId: productId,
                quantity: 1
            }]
            data.items = arr
            data.totalPrice = product.price
            data.totalItems = 1
            let result = await cartModel.create(data)
            return res.send(result)

        } else {
            let check = false;
            let itemsArr = cart.items
            itemsArr.forEach(x => {
                if (x.productId == productId) {
                    x.quantity += 1
                    check = true
                }
            })

            if (!check) {
                itemsArr.push({
                    productId: productId,
                    quantity: 1
                })
            }
            data.items = itemsArr
            data.totalPrice = cart.totalPrice + product.price
            data.totalItems = itemsArr.length;

            let result = await cartModel.findOneAndUpdate({ _id: cart._id }, data, { new: true })
            return res.status(201).send({ status: true, message: "Success", data: result })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

//=============================== get cart api ======================================================

const getCart = async (req, res) => {
    try {
        let user = req.userByUserId

        let cart = await cartModel.findOne({ userId: user._id }).populate({ path: "items.productId", select: { title: 1, price: 1, productImage: 1 } }).lean()
        if (!cart) { return res.status(404).send({ status: false, message: "Cart does not Exits !" }) }
        if (cart.items.length == 0) { return res.status(404).send({ status: false, message: "Cart is empty !" }) }

        cart.items.forEach(x => delete x._id)

        return res.status(200).send({ status: true, message: "Success", data: cart })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//=============================== update cart api ======================================================

const updateCart = async (req, res) => {
    try {

        let user = req.userByUserId

        let { productId, cartId, removeProduct } = req.body;

        if (!productId) return res.status(400).send({ status: false, message: "ProductId is mandatory !" });
        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: " Enter a valid productId !" }); }
        let product = await productModel.findOne({ _id: productId });

        if (!cartId) return res.status(400).send({ status: false, message: "cartId is mandatory !" });
        if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, message: " Enter a valid cartId !" }); }
        let cart = await cartModel.findOne({ userId: user._id });
        if (!cart || cart.items.length == 0) return res.status(404).send({ status: false, msg: "cart does not exist !" });

        if (!removeProduct && removeProduct != 0) return res.status(400).send({ status: false, message: "Please enter removeProduct key !", });

        let data = {}
        data.userId = user._id

        if (removeProduct == 0) {

            let check = false;
            let deleteProduct;
            let itemArr = cart.items
            itemArr.forEach(x => {
                if (x.productId == productId) {
                    check = true
                    deleteProduct = x
                    let i = itemArr.indexOf(x)
                    itemArr.splice(i, i + 1)
                }
            })
            if (!check) { return res.status(400).send({ status: false, message: "No such product exits in cart" }) }

            data.items = itemArr
            data.totalPrice = cart.totalPrice - (product.price * deleteProduct.quantity)
            data.totalItems = itemArr.length

            let result = await cartModel.findOneAndUpdate({ userId: user._id }, data, { new: true })

            return res.status(200).send({ status: true, data: result })

        } else if (removeProduct == 1) {

            let check = false;
            let itemArr = cart.items
            itemArr.forEach(x => {
                if (x.productId == productId) {
                    check = true
                    if (x.quantity > 1) {
                        x.quantity -= 1
                    } else {
                        let i = itemArr.indexOf(x)
                        itemArr.splice(i, i + 1)
                    }

                }
            })
            if (!check) { return res.status(400).send({ status: false, message: "No such product exits in cart" }) }

            data.items = itemArr
            data.totalPrice = cart.totalPrice - product.price
            data.totalItems = itemArr.length

            let result = await cartModel.findOneAndUpdate({ userId: user._id }, data, { new: true })

            return res.status(200).send({ status: true, message: "Success", data: result })

        } else {
            return res.status(400).send({ status: false, message: "please enter valid removeProduct value (0/1) " })
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

//=============================== delete cart api ======================================================

const deleteCart = async (req, res) => {
    try {
        let user = req.userByUserId

        let cartData = await cartModel.findOne({ userId: user._id })
        if (!cartData) { return res.status(404).send({ status: false, msg: "Cart is not found !" }) }
        if (cartData.items.length == 0) { return res.status(400).send({ status: false, msg: "Cart is alredy deleted !" }) }

        let data = {
            userId: user._id,
            items: [],
            totalPrice: 0,
            totalItems: 0
        }

        await cartModel.findOneAndUpdate({ userId: user._id }, { $set: data })
        res.status(204).send({ status: true, message: "Cart is deleted ! " })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createCart, getCart, updateCart, deleteCart }