import { useContext, useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import axios from "axios";
import { useRouter } from "next/router";
import UserContext from "../context/userContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "@/components/Spinner";

const AuthForm = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (isRegister) {
      const registerData = { ...formData };
      try {
        await axios.post(`${BASE_URL}register`, registerData);
        setIsRegister(false);
        toast.success("Registered Successfully");
        setLoading(false);
      } catch (error) {
        toast.error("Error while registering");
        console.log(error.message);
        setLoading(false);
      }
    } else {
      const loginData = { username: formData.username, password: formData.password };
      try {
        const response = await axios.post(`${BASE_URL}login`, loginData);
        if (response) {
          localStorage.setItem("token", response.data?.token);
          localStorage.setItem("username", response.data?.data?.username);
          localStorage.setItem("email", response.data?.data?.email);
          localStorage.setItem("id", response.data?.data?._id);
          localStorage.setItem("isLoggedIn", true);
          setIsLoggedIn(true);
          router.push("/Homepage"); // Direct redirection after setting localStorage
        }
        setFormData({ username: "", password: "" });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error while logging in");
        console.log(error.message);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {isRegister ? "Register" : "Login"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : isRegister ? "Sign Up" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button variant="link" onClick={toggleForm}>
            {isRegister ? "Login" : "Register"}
          </Button>
        </p>
      </CardFooter>
      <ToastContainer autoClose={3000} />
    </Card>
  );
};

export default AuthForm;
