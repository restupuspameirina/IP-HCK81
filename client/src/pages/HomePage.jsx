import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBook } from "../store/bookSlice";
import BookCard from "../components/BookCard";

export default function HomePage() {
  const dispatch = useDispatch();

  const userRole = localStorage.getItem("role");
  const recommended = JSON.parse(localStorage.getItem("recommended"));

  console.log(recommended, "recommended <<<<<<<<<<<");

  const books = useSelector((state) => {
    return state.book.items;
  });

  useEffect(() => {
    dispatch(fetchBook());
  }, []);

  return (
    <div className="p-8 max-h-20">
      <div className="mt-8">
        {userRole === "User" && recommended?.length && (
          <div className="mb-4">
            <label className="text-xl font-semibold ml-3 text-accent">
              We think you might like this other books
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2 mb-2">
              {recommended?.map((book) => {
                return <BookCard key={book.id} book={book} />;
              })}
            </div>
          </div>
        )}

        <label className="text-xl font-semibold ml-3 text-accent">
          Let's Make Order
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2 mb-2">
          {books?.map((book) => {
            return <BookCard key={book.id} book={book} />;
          })}
        </div>
      </div>
    </div>
  );
}
