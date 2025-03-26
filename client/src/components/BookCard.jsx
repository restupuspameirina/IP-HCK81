import { useEffect, useState } from "react";
import { addItemToCart, removeItemFromCart } from "../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import currency from "../helpers/currency";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { fetchBook } from "../store/bookSlice";

export default function BookCard({ book }) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.BookId === book.id)
  );

  const userRole = localStorage.getItem("role");

  async function handleDelete() {
    try {
      const { data } = await axios({
        method: "DELETE",
        // url: `http://localhost:3001/books/${book.id}`,
        url: `https://server.littleatlas.cloud/books/${book.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      Swal.fire({
        title: "Success",
        text: "Book deleted successfully",
        icon: "success",
      });

      dispatch(fetchBook());
    } catch (error) {
      let message = "Oops... Something went wrong";
      if (error.response) {
        message = error.response.data.message;
      }

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    }
  }

  return (
<div className="card card-compact bg-base-100 w-full sm:w-60 md:w-72 lg:w-80 shadow-xl">
  <figure>
    <img
      src={book.imgUrl}
      className="w-full h-40 object-cover"
      alt={book.name}
    />
  </figure>
  <div className="card-body">
    <h2 className="card-title sm:text-base md:text-lg">{book.name}</h2>
    <p className="text-xs sm:text-sm">{book.description}</p>
    <div className="flex flex-row justify-between items-center">
      <div className="card-actions justify-start">
        <label className="badge badge-primary font-extrabold">
          {currency(book.price)}
        </label>
      </div>
      <div className="card-actions justify-end">
        {userRole === "User" && cartItem && cartItem?.quantity > 0 && (
          <>
            <button
              onClick={() => {
                dispatch(removeItemFromCart(book.BookId));
              }}
              className="btn btn-accent w-full font-extrabold sm:w-auto"
            >
              -
            </button>

            <label className="btn">{cartItem?.quantity}</label>
          </>
        )}

        {userRole === "User" && (
          <button
            onClick={() => {
              dispatch(
                addItemToCart({
                  BookId: book.id,
                  price: book.price,
                  name: book.name,
                })
              );
            }}
            className="btn btn-accent w-full sm:w-auto"
          >
            {cartItem?.quantity > 0 ? "+" : "Add Cart"}
          </button>
        )}

        {userRole && userRole !== "User" && (
          <>
            <Link
              to={"/update-book/" + book.id}
              className="btn bg-[#0A3D2E] text-white w-full font-extrabold sm:w-auto"
            >
              Update
            </Link>

            <button
              onClick={handleDelete}
              className="btn bg-[navy] text-white w-full font-extrabold sm:w-auto"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</div>
  );
}
