// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SignUpForAdmin() {
//   const navigate = useNavigate();

//   const ADMIN = {
//     name: "drop store admin",
//     email: "amrmarwan160@gmail.com",
//     password: "dropstoreAdmin@2025",
//   };

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     if (email.trim() === ADMIN.email && password === ADMIN.password) {
//       localStorage.setItem("adminName", ADMIN.name);
//       localStorage.setItem("adminLogged", "true");
//       navigate("/orderTable"); // ✅ لو البيانات صح
//     } else {
//       setError("❌ الإيميل أو الباسورد غلط");
//       navigate("/"); // ❌ لو البيانات غلط
//     }
//   }

//   return (
//     <div className="container my-5">
//       <h1 className="text-center mb-4">Smart Login</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="d-flex flex-column justify-content-center align-items-center w-50 m-auto border p-4 rounded-3 shadow"
//       >
//         <input
//           type="email"
//           name="email"
//           placeholder="Enter your email"
//           className="form-control my-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Enter your password"
//           className="form-control my-2"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="text-danger mt-2">{error}</p>}

//         <button type="submit" className="btn btn-outline-info px-4 py-2 mt-3">
//           تسجيل دخول
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpForAdmin() {
  const navigate = useNavigate();

  const ADMIN = {
    name: "drop store admin",
    email: "amrmarwan160@gmail.com",
    password: "dropstoreAdmin@2025",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ لو الأدمن بالفعل مسجل دخول، نرجعه ع الصفحة الرئيسية
  useEffect(() => {
    const isAdminLogged = localStorage.getItem("adminLogged");
    if (isAdminLogged === "yes the admin is logged in") {
      navigate("/"); // يروح على طول للـ Home
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (email.trim() === ADMIN.email && password === ADMIN.password) {
      localStorage.setItem("adminName", ADMIN.name);
      localStorage.setItem("adminLogged", "yes the admin is logged in");
      navigate("/orderTable"); // ✅ لو البيانات صح
    } else {
      setError("❌ الإيميل أو الباسورد غلط");
      navigate("/"); // ❌ لو البيانات غلط
    }
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Smart Login</h1>

      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column justify-content-center align-items-center w-50 m-auto border p-4 rounded-3 shadow"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="form-control my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="form-control my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-danger mt-2">{error}</p>}

        <button type="submit" className="btn btn-outline-info px-4 py-2 mt-3">
          تسجيل دخول
        </button>
      </form>
    </div>
  );
}
