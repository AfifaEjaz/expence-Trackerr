import express from 'express'
const router = express.Router()
import { createExpense, getExpense, updateExpense, deleteExpense } from "./controller.js";

router.get("/allexpense", getExpense)
router.post("/addexpense", createExpense)
router.post("/updateexpense", updateExpense)
router.post("/deleteexpense", deleteExpense)

export default router

