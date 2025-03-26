import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

export default function AuthLayout() {
    const nav = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("access_token")) {
            nav('/login');
        }
    }, []);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}