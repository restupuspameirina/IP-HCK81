import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../store/orderSlice";

export default function HistoryOrder() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order);

    console.log(orders, "orders <<<<<<<<<<<<<<<");
    
    useEffect(() => {
        dispatch(fetchOrder());
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-extrabold text-accent ml-3 mb-4">Order List</h2>
            <div className="bg-secondary shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-base-100">
                <thead>
                    <tr className="bg-primary">
                        <th className="p-3">No.</th>
                        <th className="p-3">Code Trx</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.items?.map((order, idx) => (
                        <tr
                            key={idx+1}
                            className="border-t hover:bg-secondary transition"
                        >
                            <td className="p-3">{idx+1}</td>
                            <td className="p-3">{order.codeOrder}</td>
                            <td className="p-3">{order.paymentStatus}</td>
                            {order?.paymentStatus === "Pending" && (
                                <td className="p-3"><button className="btn btn-warning">Pay</button></td>
                            )}

                            {order?.paymentStatus === "Success" && (
                                <td className="p-3">Success</td>
                            )}

                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}