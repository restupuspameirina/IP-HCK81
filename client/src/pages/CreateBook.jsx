import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenre } from "../store/genreSlice";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

export default function CreateBook() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genre.items);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imgUrl: "",
    stock: "",
    GenreId: "",
  });

  async function handleCreateBook(e) {
    try {
      e.preventDefault();
      const { data } = await axios({
        method: "POST",
        // url: "http://localhost:3001/books",
        url: `https://server.littleatlas.cloud/books`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: form,
      });

      Swal.fire({
        title: "Success",
        text: "Book added successfully",
        icon: "success",
      });

      nav("/");
    } catch (error) {
      console.log(error, "error <<<<<<<<<<<");

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

  function changeItem(key, value) {
    let newForm = {
      ...form,
    };

    newForm[key] = value;
    setForm(newForm);
  }

  useEffect(() => {
    dispatch(fetchGenre());
  }, []);

  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 w-screen">
        <div className="h-full shadow-2xl w-full p-6 sm:p-8 max-w-md bg-100">
          <label className="text-2xl font-semibold text-center block">
            Add Book
          </label>

          <form
            onSubmit={handleCreateBook}
            className="form-control w-full max-w-xs mt-8 mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg"
          >
            <span className="label-text mt-4">Name:</span>
            <input
              onChange={(e) => changeItem("name", e.target.value)}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />

            <span className="label-text mt-4">Description:</span>
            <input
              onChange={(e) => changeItem("description", e.target.value)}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />

            <span className="label-text mt-4">Price:</span>
            <input
              onChange={(e) => changeItem("price", e.target.value)}
              type="number"
              placeholder="Type here"
              className="input input-bordered w-full"
            />

            <span className="label-text mt-4">Image Url:</span>
            <input
              onChange={(e) => changeItem("imgUrl", e.target.value)}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />

            <span className="label-text mt-4">Stock:</span>
            <input
              onChange={(e) => changeItem("stock", e.target.value)}
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
            />

            <span className="label-text mt-4">Genre</span>
            <select
              onChange={(e) => changeItem("GenreId", e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Genre:</option>
              {genres?.map((genre) => {
                return (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                );
              })}
            </select>

            <button type="submit" className="btn btn-accent mt-8 w-full">
              Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
