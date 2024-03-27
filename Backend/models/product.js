import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
        type: Number,
        required: [true, 'please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 digits']
    },
    description: {
        type: String,
        required: [true, 'Please enter product name'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category'],
        enum: {
            values: [
                "Accessories",
                "Books",
                "Cameras",
                "Electronics",
                "Food",
                "Headphones",
                "Home",
                "Laptops",
                "Outdoor",
                "Sports",
            ],
            message: "Please select correct category",
        }
    },
    seller: {
        type: String,
        required: [true, 'please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'please enter product stock']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
},
    { timestamps: true }
);
//  exports a MongoDB model named "Product" which is created based on the productSchema schema definition, allowing it to interact with the "products" collection in the database.
export default mongoose.model("Product",productSchema); // giving db 