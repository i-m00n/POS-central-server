// src/pages/Login.tsx
import { useState } from "react";

function Login({ onLogin }: { onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<boolean>(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("expiryTime", data.expiresIn);
          if (onLogin) onLogin();
        } else {
          setAlert(true);
        }
      });
  };

  return (
    <div className="login-container flex justify-center items-center h-screen bg-bg-color">
      <form onSubmit={handleSubmit} className="p-8 bg-lighterGray shadow-md rounded">
        {alert && (
          <div className="text-center text-whi flex justify-center">
            <p className="bg-light-red p-2 rounded-sm text-xl mb-4">ادخل كلمة السر الصحيحه!</p>
          </div>
        )}
        <h2 className="text-xl text-whi font-bold mb-4">تسجيل الدخول</h2>
        <input
          type="text"
          placeholder="الاسم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-3 p-2 border rounded w-full bg-gray-100 placeholder:text-paleGray"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 p-2 border rounded w-full bg-gray-100 placeholder:text-paleGray"
        />
        <button
          type="submit"
          className="w-full p-2 bg-paleOrange hover:bg-darkOrange hover:shadow-md hover:shadow-darkgray transition-all text-white rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
