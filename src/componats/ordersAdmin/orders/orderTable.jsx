import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiLink from "../../../apiLink";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const API_URL = `${apiLink}/orders`;

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLogged");
    if (isAdmin !== "yes the admin is logged in") {
      window.location.href = "/";
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
      alert("حصل خطأ أثناء تحديث الحالة");
    } finally {
      setUpdating(null);
    }
  }
const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

useEffect(() => {
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 992);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  function handleDelete(documentId) {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا الطلب؟");
    if (!confirmDelete) return;

    fetch(`${API_URL}/${documentId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("فشل الحذف");
        setOrders((prev) => prev.filter((o) => o.documentId !== documentId));
      })
      .catch((err) => {
        console.error(err);
        alert("حصل خطأ أثناء حذف الطلب");
      });
  }

  const acceptedOrders = orders.filter(
    (order) => order.order_status === "accepted"
  );
  const totalSales = acceptedOrders.reduce(
    (sum, order) => sum + (order.total_price || 0),
    0
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );

if (!isLargeScreen) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-center">
      <h3 className="text-danger fw-bold">
        ❌ الصفحة متاحة فقط على الشاشات الكبيرة
      </h3>
    </div>
  );
}
  return (
    <div className="container my-5 ">
      <motion.h1
        className="text-center mb-4 fw-bold text-info"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📦 جميع الطلبات
      </motion.h1>

      {orders.length === 0 ? (
        <h3 className="text-center text-muted">لا توجد طلبات حالياً</h3>
      ) : (
        <div className="table-responsive shadow  rounded-4 overflow-hidden">
          <table className="table table-hover align-middle text-center">
            <thead className="table-info">
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>رقم الهاتف</th>
                <th> هاتف بديل</th>
                <th>العنوان</th>
                <th>إجمالي السعر</th>
                <th>طريقة الدفع</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
                <th>الصورة</th>
                <th>تفاصيل المنتجات</th>
                <th>تاريخ الطلب</th>
                <th>الوقت</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const date = new Date(order.createdAt);
                const formattedDate = date.toLocaleDateString("ar-EG");
                const formattedTime = date.toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <motion.tr
                    key={order.documentId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td>{i + 1}</td>
                    <td>{order.client_name}</td>
                    <td>{order.phone_number}</td>
                     <td>{order.second_number || "—"}</td>
                    <td>{order.full_address}</td>
                    <td>{order.total_price} ج.م</td>
                    <td>
                      {order.payment_method === "Cash_On_delivery"
                        ? "الدفع عند الاستلام"
                        : order.payment_method}
                    </td>
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
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          disabled={updating === order.documentId}
                          onClick={() =>
                            handleStatusChange(order.documentId, "accepted")
                          }
                        >
                          قبول
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          disabled={updating === order.documentId}
                          onClick={() =>
                            handleStatusChange(order.documentId, "cancelled")
                          }
                        >
                          رفض
                        </button>
                      </div>
                    </td>
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
                    <td>{formattedDate}</td>
                    <td>{formattedTime}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(order.documentId)}
                      >
                        حذف
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* مستخلص المبيعات */}
      <div className="my-5">
        <motion.h2
          className="text-center mb-4 fw-bold text-success"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          💰 مستخلص المبيعات
        </motion.h2>

        <h5 className="text-center mb-3 text-dark">
          إجمالي المبيعات المقبولة:{" "}
          <span className="text-success fw-bold">{totalSales} ج.م</span>
        </h5>

        <div className="d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: 800 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={acceptedOrders.map((o, i) => ({
                  name: `طلب ${i + 1}`,
                  total: o.total_price,
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

