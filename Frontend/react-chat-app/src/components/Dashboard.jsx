import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io("http://localhost:3000")

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [chat, setchat] = useState("");
  const [chatlist, setchatlist] = useState([]);

  useEffect(() => {
    let fetchUserData = async () => {
      try {
        let response = await axios.get("http://localhost:3000/auth/dashboard", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setuser(response.data.data);
        }
      } catch (error) {
        console.log("Unauthorized or session expired", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    socket.on("New Mesg", (data) => {
      setchatlist((list) => [...list, data]);
    });

    return () => {
      socket.off("New Mesg");
    };
  }, []);

  let handlesession = async () => {
    try {
      let response = await axios.post("http://localhost:3000/auth/logout", {}, {
        withCredentials: true,
      })
      if (response.status === 200) {
        navigate("/login");
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  let handledelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        let response = await axios.delete("http://localhost:3000/auth/deleteuser", {
          withCredentials: true,
        })
        if (response.status === 200) {
          navigate("/Register");
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  const sendmessages = (e) => {
    e.preventDefault();

    if (chat.trim() !== "") {
      const Mesgdata = {
        auther: user ? user.name : "Muhammad Ahsan", // Logged-in user ka naam
        message: chat,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Server par "Mesg send" event emit karna hai
      socket.emit("Mesg send", Mesgdata);
      setchat("");
    }
  }

  return (
    <div className='min-h-screen bg-amber-200 w-full flex flex-col items-start p-2'>
      <nav className='bg-amber-400 p-4 sm:p-6 shadow-md w-full flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl'>
        <h1 className='text-xl font-bold'> Dashboard </h1>
        <h1 className='text-lg font-medium'> Welcome, {user ? user.name : "Loading..."}</h1>
        <div className='flex gap-3'>
          <button onClick={handlesession} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm'>
            Logout
          </button>
          <button onClick={handledelete} className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm'>
            Delete Account
          </button>
        </div>
      </nav>

      <div className="w-full mt-4 p-4">
        <h2 className="text-xl font-bold mb-2">Chat App</h2>
        
        {/* Chat messages list box */}
        <div className="border border-amber-400 bg-white h-64 overflow-y-scroll p-3 rounded-lg mb-3">
          {chatlist.map((item, index) => {
            return (
              <div key={index} className="mb-2 border-b pb-1">
                <span className="font-bold text-blue-600">{item.auther}: </span>
                <span>{item.message}</span>
                <span className="text-xs text-gray-400 ml-2">({item.time})</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendmessages} className="flex gap-2">
          <input 
            type='text' 
            value={chat} 
            onChange={(e) => setchat(e.target.value)}
            placeholder="Type a message..."
            className="border p-2 rounded-lg w-full bg-white"
          />
          <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard