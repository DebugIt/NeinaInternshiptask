import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function TableComponent() {
  const [leaderEntries, setLeaderEntries] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_USER_URL;

  const [storeUser, setStoreUser] = useState("");
  const [history, setHistory] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function sortByPoints(entries) {
    return entries.sort((a, b) => b.points - a.points);
  }

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-users`);
      const newEntries = sortByPoints(response.data?.data);
      setLeaderEntries(newEntries);
      console.log(response.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const claimPoints = async (username) => {
    try {
      const data = { username };
      const response = await axios.patch(`${BASE_URL}claim-points`, data);
      toast.success('Points claimed successfully');
      fetchDetails();
      console.log(response.data);

      const historyResponse = await axios.post(`${BASE_URL}your-history`, data);
      console.log(historyResponse.data?.data);
      setHistory(historyResponse.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      <div id="leaderBoard" className="md:flex justify-between">
        {leaderEntries.slice(0, 3).map((entry, index) => (
          <div key={index} id="top1">
            <div>{entry ? `${entry.firstName} ${entry.lastName}` : "N/A"}</div>
            <div>{entry ? entry.Points : "N/A"}</div>
            <div>Prize: ₹ {entry ? entry.Points : "N/A"}</div>
          </div>
        ))}
      </div>

      <Table>
        <TableCaption>Have a Look at the Leaderboard</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Prize</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderEntries.map((invoice, index) => (
            <TableRow key={index}>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <TableCell
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => {
                    claimPoints(invoice.username);
                    setStoreUser(invoice.username);
                    setIsDialogOpen(true); // Open dialog on click
                  }}
                >
                  <DialogTrigger asChild>
                    <span>{invoice.firstName + " " + invoice.lastName}</span>
                  </DialogTrigger>
                </TableCell>
                <TableCell className="text-red-500">Prize: ₹{invoice.Points}</TableCell>
                <TableCell className="text-green-500">{invoice.Points}</TableCell>

                <DialogContent className="w-80 ">
                  <DialogHeader>
                    <DialogTitle>{storeUser}'s History</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 h-[70vh] overflow-y-scroll">
                    {history.map((his, idx) => (
                      <div key={idx} className="grid gap-2">
                        <Label> <span className="font-bold">Date:</span> {his.date} </Label>
                        <Label> <span className="font-bold">Points Awarded:</span> {his.pointsAwarded} </Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ToastContainer autoClose={3000}/>
    </>
  );
}
