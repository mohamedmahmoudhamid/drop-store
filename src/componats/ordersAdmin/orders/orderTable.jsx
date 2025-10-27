import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiLink from "../../../apiLink";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const API_URL = `${apiLink}/orders`;

  // ✅ حتة الأمان
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLogged");
    if (isAdmin !== "yes the admin is logged in") {
      window.location.href = "/"; // لو مش أدمن يرجعه للصفحة الرئيسية
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  async function handleStatusChange(documentId, newStatus) {
    try {
      setUpdating(documentId);

      const res = await fetch(`${API_URL}/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            order_status: newStatus,
            order_items: orders
              .find((o) => o.documentId === documentId)
              ?.order_items?.map((item) => item.documentId),
          },
        }),
      });

      if (!res.ok) throw new Error("فشل التحديث");

      setOrders((prev) =>
        prev.map((order) =>
          order.documentId === documentId
            ? { ...order, order_status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("❌ حصل خطأ أثناء تحديث الحالة");
    } finally {
      setUpdating(null);
    }
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );

  return (
    <div className="container my-5">
      <motion.h1
        className="text-center mb-4 fw-bold text-info"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📦 جميع الطلبات
      </motion.h1>

      {orders.length === 0 ? (
        <h3 className="text-center text-muted">لا توجد طلبات حالياً 😴</h3>
      ) : (
        <div className="table-responsive shadow rounded-4 overflow-hidden">
          <table className="table table-hover align-middle text-center">
            <thead className="table-info">
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>رقم الهاتف</th>
                <th>العنوان</th>
                <th>إجمالي السعر</th>
                <th>طريقة الدفع</th>
                <th>الحالة</th>
                <th>تغيير الحالة</th>
                <th>الصورة</th>
                <th>تفاصيل المنتجات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.documentId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td>{i + 1}</td>
                  <td>{order.client_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.full_address}</td>
                  <td>{order.total_price} ج.م</td>
                  <td>
                    {order.payment_method === "Cash_On_delivery"
                      ? "الدفع عند الاستلام"
                      : order.payment_method}
                  </td>

                  {/* الحالة */}
                  <td>
                    <span
                      className={`badge ${
                        order.order_status === "pending"
                          ? "bg-warning text-dark"
                          : order.order_status === "accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>

                  {/* تعديل الحالة */}
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.order_status}
                      onChange={(e) =>
                        handleStatusChange(order.documentId, e.target.value)
                      }
                      disabled={updating === order.documentId}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="accepted">✅ Accepted</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>

                  {/* إيصال الدفع */}
                  <td>
                    {order.proofImage_Link ? (
                      <a
                        href={order.proofImage_Link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-info"
                      >
                        عرض
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* تفاصيل المنتجات */}
                  <td>
                    {order.order_items.length > 0 ? (
                      <details>
                        <summary
                          className="text-info"
                          style={{ cursor: "pointer" }}
                        >
                          عرض ({order.order_items.length})
                        </summary>
                        <ul className="list-unstyled mt-2">
                          {order.order_items.map((item, j) => (
                            <li key={j} className="border-top pt-2">
                              <b>{item.product_name}</b> - {item.product_color}{" "}
                              / {item.product_size}
                              <br />
                              السعر بعد الخصم: {item.final_price} ج.م ×{" "}
                              {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      "—"
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
