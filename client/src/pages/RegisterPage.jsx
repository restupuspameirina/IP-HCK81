import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"

export default function Register() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "",
        address: "",
    })

    async function handleRegister(e) {
        try {
            e.preventDefault();

            const { data } = await axios({
                method: "POST",
                // url: "http://localhost:3001/register",
                url: "https://server.littleatlas.cloud/register",
                data: form
            })

            Swal.fire({
                title: "Success",
                text: "Success Register Account",
                icon: "success"
            })

            nav('/login');
            
        } catch (error) {
            let message = 'Oops... Something went wrong';
            if (error.response) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: "Error",
                text: message,
                icon: "error"
            })
        }
    }


    function changeItem(key, value) {
        let newForm = {
            ...form,
        };
        
        newForm[key] = value;
        setForm(newForm);
    }

    return (
        <div className="flex flex-row justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 w-screen">
                <div className="h-full shadow-2xl w-full p-6 sm:p-8 max-w-md bg-100">
                    <label className="text-2xl font-semibold text-center block">Register Now</label>

                    <form 
                        onSubmit={handleRegister}
                        className="form-control w-full max-w-xs mt-8 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg"
                    >
                        <span className="label-text">Full Name:</span>
                        <input 
                            onChange={(e) => changeItem('fullName', e.target.value)}
                            type="text" 
                            placeholder="Type here" 
                            className="input input-bordered w-full" />

                        <span className="label-text mt-4">Email:</span>
                        <input 
                            onChange={(e) => changeItem('email', e.target.value)}
                            type="email" 
                            placeholder="Type here" 
                            className="input input-bordered w-full" />

                        <span className="label-text mt-4">Password:</span>
                        <input 
                            onChange={(e) => changeItem('password', e.target.value)}
                            type="password" 
                            placeholder="Type here" 
                            className="input input-bordered w-full" />

                        <span className="label-text mt-4">Phone Number:</span>
                        <input 
                            onChange={(e) => changeItem('phoneNumber', e.target.value)}
                            type="text" 
                            placeholder="Type here" 
                            className="input input-bordered w-full" />

                        <span className="label-text mt-4">Gender</span>
                        <select 
                            onChange={(e) => changeItem('gender', e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Gender:</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <span className="label-text mt-4">Address:</span>
                        <textarea 
                            onChange={(e) => changeItem('address', e.target.value)}
                            type="text" 
                            placeholder="Type here" 
                            className="input input-bordered w-full p-3" />

                        <button type="submit" className="btn btn-accent mt-8 w-full">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}