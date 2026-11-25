import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io("https://chat-app-production-36514a82.up.railway.app/", {
  transports: ["websocket"],
  withCredentials: true
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [chat, setchat] = useState("");
  const [chatlist, setchatlist] = useState([]);
  const [userlist, setuserlist] = useState([])
  const [selectuser, setselectuser] = useState(null)

  useEffect(() => {
    let fetchUserData = async () => {
      try {
        let response = await axios.get("https://chat-app-production-36514a82.up.railway.app/auth/dashboard", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setuser(response.data.data);
        }

        let userchat = await axios.get("https://chat-app-production-36514a82.up.railway.app/auth/users", {
          withCredentials: true,
        })

        if (userchat.status === 200) {
          setuserlist(userchat.data.data)
        }

      } catch (error) {
        console.log("Unauthorized or session expired", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // useEffect(() => {

  //   socket.on("Old Messages", (oldmesg) => {
  //     setchatlist(oldmesg);
  //   })

  //   socket.on("New Mesg", (data) => {
  //     setchatlist((list) => [...list, data]);
  //   });

  //   socket.emit("Old Messages");

  //   return () => {
  //     socket.off("New Mesg");
  //     socket.off("Old Messages")
  //   };
  // }, []);


  useEffect(() => {
    if (user && user._id) {
      socket.emit("join", user._id);
    }
  }, [user]);


  useEffect(() => {
    if (!user || !selectuser) return;

    setchatlist([]);
    socket.emit("Private Messages", {
      senderId: user._id,
      receiverId: selectuser._id,
    });
  }, [user, selectuser]);


  useEffect(() => {
    socket.on("Private Messages", (messages) => {
      setchatlist(messages);
    });

    socket.on("New Mesg", (data) => {
      if (!user || !selectuser) return;

      const isForCurrentChat =
        (String(data.senderId) === String(user._id) &&
          String(data.receiverId) === String(selectuser._id)) ||
        (String(data.senderId) === String(selectuser._id) &&
          String(data.receiverId) === String(user._id));

      if (isForCurrentChat) {
        setchatlist((list) => [...list, data]);
      }
    });

    return () => {
      socket.off("Private Messages");
      socket.off("New Mesg");
    };
  }, [user, selectuser]);

  let handlesession = async () => {
    try {
      let response = await axios.post("https://chat-app-production-36514a82.up.railway.app/auth/logout", {}, {
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
        let response = await axios.delete("https://chat-app-production-36514a82.up.railway.app/auth/deleteuser", {
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

    if (chat.trim() !== "" && user && selectuser) {
      const Mesgdata = {
        senderId: user._id,
        receiverId: selectuser._id,
        auther: user ? user.name : "Muhammad Ahsan",
        message: chat,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };


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


      <h2 className="text-xl font-bold mb-2">Chat App</h2>
      <div className="w-full mt-4 p-4 flex flex-col md:flex-row gap-4">

        <div className="w-full md:w-1/3 bg-white border border-amber-400 rounded-xl p-3">
          <h2 className="text-lg font-bold mb-2">Users</h2>
          {userlist.map((item) => (
            <div
              key={item._id}
              onClick={() => setselectuser(item)}
              className={`p-2 mb-2 rounded-lg cursor-pointer border ${selectuser && selectuser._id === item._id
                ? "bg-amber-300 font-bold"
                : "bg-gray-50 hover:bg-amber-100"
                }`}
            >
              <p>{item.name}</p>
              <p className="text-xs text-gray-500">{item.email}</p>
            </div>
          ))}
        </div>

        {/* Right Side: Chat Area */}
        <div className="w-full md:w-2/3 bg-white border border-amber-400 rounded-xl p-3">
          <h2 className="text-xl font-bold mb-2">
            Chat with: {selectuser ? selectuser.name : "Select a user"}
          </h2>

          {/* Chat messages list box */}
          {<div className="border border-amber-400 bg-white h-64 overflow-y-scroll p-3 rounded-lg mb-3">
            {chatlist.map((item, index) => {
              let boxClass = "bg-gray-100 mr-auto";

              if (user && String(item.senderId) === String(user._id)) {
                boxClass = "bg-green-200 ml-auto";
              }
              return (
                <div key={index} className={`mb-2 p-2 rounded-lg max-w-xs ${boxClass}`}>
                  <span className="font-bold text-blue-600">{item.auther}: </span>
                  <span>{item.message}</span>
                  <span className="text-xs text-gray-400 ml-2">({item.time})</span>
                </div>
              );
            })}
          </div>}



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
    </div>
  )
}

export default Dashboard