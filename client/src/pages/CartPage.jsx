import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function CartPage() {
  const cart = useSelector((state) => state.cart);

  async function handleUpdate(order_id) {
    try {
      console.log("masuk update <<<<<<<<<<<", order_id);

      await axios({
        method: "PATCH",
        // url: `http://localhost:3001/orders/${order_id}`,
        url: `https://server.littleatlas.cloud/orders/${order_id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("successssss update <<<<<<<<<<<");

      window.location.href = "/";
    } catch (error) {
      console.log(error, "error updateeeeee <<<<<<<<<<<");
    }
  }

  async function handleCheckOut() {
    try {
      //   console.log(cart.items, "cart <<<<<<<<<<<<<<<");

      // Create the order (POST request)
      const { data } = await axios({
        method: "POST",
        // url: "http://localhost:3001/orders",
        url: `https://server.littleatlas.cloud/orders`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: {
          totalAmount: cart.totalPrice,
          orderItems: cart.items,
        },
      });

      console.log(data, "data <<<<<<<<<<<");

      // Trigger Midtrans payment popup
      window.snap.pay(data.midtransToken.token, {
        onSuccess: async function (result) {
          console.log("success");
          console.log(result, "<><><><><>");

          try {
            // Update the payment status in the database (PATCH request)

            // Show success message
            Swal.fire({
              title: "Payment Successful",
              text: "Your payment has been completed. Thank you!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              // Navigate to the homepage after the user clicks "OK"
              setTimeout(async () => {
                await handleUpdate(data.order.id);
              }, 3000);

              //   nav("/");
            });
          } catch (error) {
            console.error("Failed to update payment status:", error);

            Swal.fire({
              title: "Error",
              text: "Payment was successful, but we couldn't update the status. Please contact support.",
              icon: "error",
            });
          }
        },
      });
    } catch (error) {
      console.log(error, "error <<<<<<<<<<<<<<<<<<");

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-extrabold text-accent ml-3 mb-4">
        Order List
      </h2>
      <div className="bg-secondary shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse bg-base-100">
          <thead>
            <tr className="bg-primary">
              <th className="p-3">No.</th>
              <th className="p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">@Price</th>
              <th className="p-3">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.items?.map((order, idx) => (
              <tr
                key={idx + 1}
                className="border-t hover:bg-secondary transition"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.price}</td>
                <td className="p-3">{order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card justify-end bg-base-100 p-3">
        <p className="text-xl font-extrabold text-end">
          Total Check-out: {cart.totalPrice}
        </p>
        <button onClick={handleCheckOut} className="btn btn-accent mt-4">
          Check-out
        </button>
      </div>
    </div>
  );
}
