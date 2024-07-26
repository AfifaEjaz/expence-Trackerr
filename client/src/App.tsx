import { useEffect, useState, Dispatch, SetStateAction } from "react"
import axios from "axios"
import { BiAperture } from "react-icons/bi"
import { MdDelete } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BiSolidCategory } from "react-icons/bi";
import { IoMdPricetags } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { z, ZodType } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UpdateExpense from "./components/UpdateExpense";
import Col from 'react-bootstrap/Col';


interface Expense {
  _id: string,
  category: string,
  amount: number,
  description: string,
  date: string
}

type formData = {
  category: string,
  amount: number,
  description: string
}

function App() {

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totalCharges, setTotalCharges] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedAmountRange, setSelectedAmountRange] = useState("")
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])

  //Data fetching
  useEffect(() => {
    axios.get(`${window.location.origin}/api/allexpense`)
      .then((json) => {
        setExpenses(json.data.result);
        setFilteredExpenses(json.data.result)

        const total = json.data.result.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)
        setTotalCharges(total);
      })
      .catch((error => {
        console.log("Error fetching expenses", error);
      }))
  }, [])

  //Adding new data
  const schema: ZodType<formData> = z.object({
    category: z.string().min(3).max(50),
    amount: z.number(),
    description: z.string()
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<formData>({ resolver: zodResolver(schema) })

  const submitData = (data: formData) => {
    console.log("its working", data);
    axios.post(`${window.location.origin}/api/addexpense`, data).then((json) => {
      setFilteredExpenses(json.data.result)
      console.log("Expense Added");
      const total = json.data.result.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)
      setTotalCharges(total);
    })
      .catch((error) => console.log(error))
    reset()
  }


  const deleteExpense = (_id: string) => {
    axios.post(`${window.location.origin}/api/deleteexpense`, { _id }).then((json) => {
      setFilteredExpenses(json.data.result)
      console.log("Expense Deleted");
      const total = json.data.result.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)
      setTotalCharges(total);
    })
      .catch((error) => console.log(error))
  }

  // Function to update expenses and total charges after update
  const updateExpensesAndTotal: Dispatch<SetStateAction<Expense[]>> = (updatedExpenses: Expense[] | ((prevState: Expense[]) => Expense[])) => {
    if (Array.isArray(updatedExpenses)) {
      setFilteredExpenses(updatedExpenses)
      const total = updatedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
      setTotalCharges(total);
    } else {
      setFilteredExpenses(updatedExpenses(expenses));
    }
  }

  const handleFilterChange = () => {
    if (selectedCategory === "All Categories..." || selectedAmountRange === "All Ranges") {
      setFilteredExpenses(expenses)
      return
    }

    const filtered = expenses.filter((expense) => {
      const categoryMatch = selectedCategory ? expense.category === selectedCategory : true
      console.log(categoryMatch);
      const amountMatch = selectedAmountRange ? (
        selectedAmountRange === '0$ to 500$' ? expense.amount <= 500 :
        selectedAmountRange === '500$ to 1000$' ? expense.amount > 500 && expense.amount <= 1000 :
        selectedAmountRange === '1000$ and onwards' ? expense.amount > 1000 :
        true
      ) : true;
      return categoryMatch && amountMatch;
    })
    setFilteredExpenses(filtered)
  }

  useEffect(() => {
    handleFilterChange()
  }, [selectedCategory, selectedAmountRange])


  return (
    <>
      <div className="container d-flex justify-content-center" style={{ height: '100vh', width: '100%' }}>
        <div className="row gap-5 mt-4" style={{ height: '80vh', width: '100%' }}>
          <div className="col-md-5 border rounded p-3" >
            <h1 className='border-bottom mb-3'>OVH Expense Tracker</h1>

            <Form onSubmit={handleSubmit(submitData)}>
              <Form.Group className="mb-3" >
                <Form.Label> <BiSolidCategory /> Category</Form.Label>
                <Form.Control type="text" required id='name' placeholder="Enter Category" {...register("category")} />
                {errors.category && <p className="text-danger">{errors.category.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label><IoMdPricetags /> Amount</Form.Label>
                <Form.Control type="number" required id='name' placeholder="Enter Amount" {...register("amount", { valueAsNumber: true })} />
                {errors.amount && <p className="text-danger">{errors.amount.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label><MdDescription /> Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register("description")} />
              </Form.Group>
              <Button style={{ backgroundColor: "#541C46" }} type="submit">
                Submit
              </Button>
            </Form>
          </div>
          <div className="col-md-6 border rounded p-3" >

            <div className="mt-1 rounded py-1 px-2 text-light" style={{ backgroundColor: "#541C46" }}>
              <h6 className="text-secondary">Total:</h6>
              <h2>{totalCharges}$</h2>
            </div>

            <div>
              <div className="d-flex mt-2 gap-1">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select onChange={(e) => setSelectedCategory(e.target.value)} defaultValue="Category...">
                    <option onChange={() => !selectedCategory}>All Categories...</option>
                    {
                      [...new Set(expenses.map((expense) => expense.category))].map((category, key) =>
                        <option key={key}>{category}</option>
                      )
                    }
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select defaultValue="Category..." onChange={(e) => setSelectedAmountRange(e.target.value)}>
                    <option>All Ranges</option>
                    <option>0$ to 500$</option>
                    <option>500$ to 1000$</option>
                    <option>1000$ and onwards</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <h4 className="text-secondary mt-2">Breakdown</h4>
              <ul className="list-group" style={{ height: '300px', overflow: 'auto' }}>
                {
                  filteredExpenses.map((val, key) =>
                    <div key={key} className="border-bottom rounded p-2 mt-1 d-flex justify-content-between">
                      <div className="w-75" ><BiAperture />  {val.category} - {val.amount}$
                        <div className="">{val.description}</div>
                      </div>
                      <div>
                        <MdDelete size={30} color="red" onClick={() => deleteExpense(val._id)} style={{ cursor: 'pointer' }} />
                        <UpdateExpense expenseID={val._id} setFilteredExpenses={updateExpensesAndTotal} />
                        <div className="text-secondary">{val.date.substring(10, 0)}</div>
                      </div>
                    </div>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
