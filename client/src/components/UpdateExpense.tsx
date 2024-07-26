import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { MdBrowserUpdated } from "react-icons/md";
import axios from 'axios';
import { z, ZodType } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BiSolidCategory } from "react-icons/bi";
import { IoMdPricetags } from "react-icons/io";
import { MdDescription } from "react-icons/md";

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

interface props {
    expenseID: string,
    setFilteredExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const UpdateExpense = ({ expenseID, setFilteredExpenses }: props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const schema: ZodType<formData> = z.object({
        category: z.string().min(3).max(50),
        amount: z.number(),
        description: z.string()
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm<formData>({ resolver: zodResolver(schema) })

    const updateData = (data: formData) => {

        const updatedExpense = { ...data, _id: expenseID };
        console.log("its working", updatedExpense);
        axios.post(`${window.location.origin}/api/updateexpense`, updatedExpense).then((json) => { 
            setFilteredExpenses(json.data.result);

            console.log("Expense Updated");
            handleClose(); 
            reset()
        })
            .catch((error) => console.log(error))

    }

    return (
        <>
            <MdBrowserUpdated size={30} color='green' onClick={handleShow} style={{ cursor: 'pointer' }}/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(updateData)}>
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
                        <hr />
                        <Button style={{ backgroundColor: "#541C46" }} type="submit" onClick={handleClose}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateExpense