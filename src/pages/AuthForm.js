import { useContext, useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import axios from "axios";
import UserContext from "../context/userContext";
import { useRouter } from "next/router";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "@/components/Spinner";


const AuthForm = () => {
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const { isLoggedIn, setIsLoggedIn } = isClient ? useContext(UserContext) : {};

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false)
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
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (isRegister) {
      setLoading(true)
      const RegisterData = { ...formData };
      try {
        const response = await axios.post(`${BASE_URL}register`, RegisterData);
        setIsRegister(false);
        toast.success("Registered Successfully")
        setLoading(false)
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setLoading(true)
      const logindata = { username: formData.username, password: formData.password };
      try {
        const response = await axios.post(`${BASE_URL}login`, logindata);
        if (isClient) {
          localStorage.setItem("token", response.data?.token);
          localStorage.setItem("username", response.data?.data?.username);
          localStorage.setItem("email", response.data?.data?.email);
          localStorage.setItem("id", response.data?.data?._id);
          localStorage.setItem("isLoggedIn", true);
          setIsLoggedIn(true);
        }
        router.push("/Homepage");
        setFormData({ username: "", password: "" });
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error.message);
      }
    }
  };

  if (!isClient) return null; 
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
            {isRegister ? "Sign Up" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          {
            loading ? (
              <Spinner />
            ) : (
              <Button variant="link" onClick={toggleForm}>
                {isRegister ? "Login" : "Register"}
              </Button>
            )
          }
        </p>
      </CardFooter>
      <ToastContainer autoClose={3000}/>
    </Card>
  );
};

export default AuthForm;
