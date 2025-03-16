import asyncHandler from "express-async-handler"
import Product from '../models/productModel.js'


// export const getAllFromCart = asyncHandler(async(req,res)=>{
//     try {
//         const products = await Product.find({_id:{$in: req.user.cartItems}})
//         //add quantity to the fetched cartItems
//         const cartItems = products.map((product)=>{
//             const item = req.user.cartItems.find(item => item.id === product.id)
//             return {...product.toJSON(),quantity: item.quantity}
//         })
//         res.json(cartItems)
//     } catch (error) {
//         console.log('error in getAllFromCart',error.message)
//         res.status(500).json({messag:error.message})
//     }
// })
export const getAllFromCart = asyncHandler(async (req, res) => {
    try {
        // Extract product IDs from the user's cart
        const productIds = req.user.cartItems.map(item => item.productId);

        // Fetch all products in the user's cart
        const products = await Product.find({ _id: { $in: productIds } });

        // Add quantity to the fetched cart items
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(item => item.productId.toString() === product._id.toString());
            return { ...product.toJSON(), quantity: item.quantity };
        });

        // Send the response
        res.json(cartItems);
    } catch (error) {
        console.error('Error in getAllFromCart:', error.message);
        res.status(500).json({ message: error.message });
    }
});


export const addToCart = async (req, res) => {
	try {
        console.log('req.body',req.body)
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.productId.toString() === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({productId, quantity: 1});
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message,error.stack);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = asyncHandler(async(req,res)=>{
    try {
        const {productId} = req.body
        const user = req.user
        if(!productId){
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter((item)=> item.id !== productId)
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log('error in removeAllFromCart',error.message)
        res.status(500).json({message: error.message})
    }
})

export const updateQuantity = async (req, res) => {
	try {
		console.log("Request received at updateQuantity");  // Debugging line
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		if (!user) {
			console.error("User not authenticated");
			return res.status(401).json({ message: "User not authenticated" });
		}

		console.log("User authenticated:", user._id);
		console.log("Product ID:", productId, "New Quantity:", quantity);
		console.log("User Cart Items:", user.cartItems);

		const existingItem = user.cartItems.find((item) => item.productId.toString() === productId);

		if (!existingItem) {
			console.error(`Product with ID ${productId} not found in cart`);
			return res.status(404).json({ message: `Product with ID ${productId} not found` });
		}

		if (quantity === 0) {
			user.cartItems = user.cartItems.filter((item) => item._id !== productId);
			await user.save();
			console.log("Product removed from cart:", productId);
			return res.json(user.cartItems);
		}

		existingItem.quantity = quantity;
		await user.save();
		console.log("Updated product quantity:", productId, "New quantity:", quantity);
		res.json(user.cartItems);
	} catch (error) {
		console.error("Error in updateQuantity controller:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

