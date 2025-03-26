import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import currency from "../helpers/currency";

export default function Navbar() {
    const nav = useNavigate();

    const userRole = localStorage.getItem('role');

    function handleLogut() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("fullName");

        nav('/login');
    }

    const cart = useSelector((state) => state.cart);

    return (
<div className="navbar bg-[#0A3D2E]">
    <div className="flex-1">
        <NavLink to={'/'} className="btn btn-ghost text-xl font-extrabold text-white">
            Atlas Book Store 📚
        </NavLink>
    </div>

    {userRole !== "User" && (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost text-white">Book</div>
            <ul
                tabIndex={0}
                className="book book-accordion dropdown-content bg-[#0A3D2E] rounded-box w-52 p-2 shadow z-50">
                <li>
                    <NavLink to={'/add-book'} className="btn btn-ghost text-white">Add Book</NavLink>
                </li>
            </ul>
        </div>
    )}
    <div className="flex-none">
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="badge badge-sm indicator-item">{cart.totalQuantity}</span>
                </div>
            </div>
            <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-[#0A3D2E] z-[1] mt-3 w-52 shadow">
                <div className="card-body">
                    <span className="text-lg font-bold text-white">{cart.totalQuantity} Items</span>
                    <span className="text-secondary">Subtotal: {currency(cart.totalPrice)}</span>
                    <div className="card-actions">
                        <NavLink to={'/my-orders'} className="btn btn-accent btn-block">View cart</NavLink>
                    </div>
                </div>
            </div>
        </div>
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="User Avatar"
                        src="https://i.pinimg.com/236x/97/43/ec/9743ecac80966a95e9d328c08b995c04.jpg" />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="book book-sm dropdown-content bg-[#0A3D2E] rounded-box z-[1] mt-3 w-52 p-2 shadow">
                {userRole === "User" && (
                    <li>
                        <NavLink to={'/history-orders'} className="btn btn-ghost text-white">History</NavLink>
                    </li>
                )}
                <li>
                    <button onClick={handleLogut} className="btn btn-ghost text-white">Logout</button>
                </li>
            </ul>
        </div>
    </div>
</div>
    )
}