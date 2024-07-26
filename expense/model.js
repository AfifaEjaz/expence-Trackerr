import { mongoose, Schema, model } from "mongoose";

const expenseSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const expenseModel = model("expense", expenseSchema)
export default expenseModel