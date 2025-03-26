import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function LoginPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    if (localStorage.getItem("access_token")) {
       return <Navigate to="/" />
    }

    async function handleLogin(e) {
        try {
            e.preventDefault();

            const { data } = await axios({
                method: "POST",
                // url: 'http://localhost:3001/login',
                url: 'https://server.littleatlas.cloud/login',
                data: form
            });

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('role', data.role);

            nav('/');

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

    async function handleCredentialResponse(response) {
        try {

            const { data } = await axios({
                method: "POST",
                // url: "http://localhost:3001/google-login",
                url: 'https://server.littleatlas.cloud/google-login',
                data: {
                    googleToken: response.credential
                }
            });

            console.log(data, "data <<<<<<<<<<<");
            

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem('role', data.user.role);
            
            nav('/');
            
        } catch (error) {
            let message = 'Oops... Something went wrong';
            if (error.response) {
                message = error.response.data.message;
            }

            Swal.fire({
                title: "Error",
                text: message,
                icon: "error"
            });
        }
    }

    useEffect(() => {

        google.accounts.id.initialize({
            client_id: "665046154166-78anrt6solkm7phq86854hb52tnd5mrr.apps.googleusercontent.com",
            callback: handleCredentialResponse
          });
      
          google.accounts.id.renderButton(
            document.getElementById("google-button"),
            { theme: "outline", size: "medium" }  // customization attributes
          );
          google.accounts.id.prompt();
    }, []);

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
                    <label className="text-2xl font-semibold text-center block">Login</label>

                    <form 
                        onSubmit={handleLogin}
                        className="form-control w-full max-w-xs mt-8 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg"
                    >
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

                        <button type="submit" className="btn btn-accent mt-8 w-full">Login</button>
                    </form>
                    <div className="mt-4 w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg" id="google-button"></div>

                    <div className="flex flex-col items-center">
                        <label className="mt-6">Don't have an account yet? <Link to={'/register'} className="text-accent" style={{textDecoration: "none"}}>Register</Link></label>
                    </div>
                </div>
            </div>
        </div>
    )
}