import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios';

const Navbar = () => {

  const BASE_URL = process.env.NEXT_PUBLIC_USER_URL
  const [userdetails, setUserDetails] = useState()

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error("Token is missing");
        return;
      }
      const response = await axios.post(
        `${BASE_URL}get-users-info`,
        {},  
        {
          headers: {
            Authorization: `${token}` 
          }
        }
      );
  
      console.log('User info:', response.data);
      setUserDetails(response.data?.data);
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
        <div id="container" className='border p-2 md:flex items-center justify-between'>
          <div id="name" className='font-bold text-xl'>Neina - Internship Task</div>
          <div id="profile-pages" className='flex gap-4 justify-between items-center '>
            <div className='flex gap-4'>
              <div className='text-black font-semibold hover:underline transition-all'>
                <Link href={"/Homepage"}>
                  Home
                </Link>
              </div>

              <div className='text-black font-semibold hover:underline transition-all'>
                <Link href={"#"}>
                  Leaderboard
                </Link>
              </div>
              
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FaRegCircleUser size={20}/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">User Details</h4>
                  </div>
                  <hr />
                  <div className="grid gap-2">
                    <Label>Username: {userdetails && userdetails.username}</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label>FirstName: {userdetails && userdetails.firstName}</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label>LastName: {userdetails && userdetails.lastName}</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label>Email: {userdetails && userdetails.email}</Label>
                  </div>
                  <hr />
                  <div className="grid gap-2">
                    <Label>Points: {userdetails && userdetails.Points}</Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div id="info-card"></div>
          </div>
        </div>
    </>
  )
}

export default Navbar