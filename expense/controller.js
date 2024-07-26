import expenseModel from "./model.js";

// create expense
export async function createExpense(req, res) {
    const { date, category, amount, description } = req.body
    console.log(category, amount, description);

    if (!category, !amount, !description) {
        res.json({
            message: "Missing Required Fields"
        })
    }
    else {
        try {
            await expenseModel.create({ date, category, amount, description })
            const result = await expenseModel.find()
            console.log("expense created")
            res.status(201).json({
                message: "expense created Successfully",
                result
            })
        } catch (error) {
            console.error("Error during expense creation:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

//Get Expense
export async function getExpense(req, res) {
    try {
        const result = await expenseModel.find()
        console.log("expense fetched")
        res.status(201).json({
            message: "expense fetched Successfully",
            result
        })
    } catch (error) {
        console.error("Error fetching expense:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//update Expense
export async function updateExpense(req, res) {
    const { _id, date, category, amount, description } = req.body

    const filter = { _id }
    const update = { date, category, amount, description }

    if (!category, !amount, !description) {
        res.json({
            message: "Missing Required Fields"
        })
    }
    else {
        try {
            await expenseModel.findOneAndUpdate(filter, update, { new: true })
            const result = await expenseModel.find()
            console.log("expense updated")
            res.status(201).json({
                message: "expense updated Successfully",
                result
            })
        } catch (error) {
            console.error("Error updating expense:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

//Delete Expense
export async function deleteExpense(req, res) {
    const { _id } = req.body

        try {
            await expenseModel.deleteOne({_id})
            const result = await expenseModel.find()
            console.log("expense Deleted")
            res.status(201).json({
                message: "expense deleted Successfully",
                result
            })
        } catch (error) {
            console.error("Error deleting expense:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    
}