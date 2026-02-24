import { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {

    const res = await API.post("/auth/login", form);

    const token = res.data.token;

    // Decode role manually or set from backend later
    const role = form.username === "admin"
      ? "ROLE_ADMIN"
      : "ROLE_KITCHEN";

    login(token, role);

    if (role === "ROLE_ADMIN") navigate("/admin");
    else navigate("/kitchen");
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;