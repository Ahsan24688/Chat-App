import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data);
    try {
      let response = await axios.post("https://chat-app-production-36514a82.up.railway.app/auth/Login", {
        email: data.email,
        password: data.password,
      },
        {
          withCredentials: true,
        })
      console.log(response.data);
      navigate("/dashboard");
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-amber-200 w-full px-4'>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-amber-400 p-6 sm:p-10 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Login</h1>
        <div>
          <label htmlFor="email" className='block mb-1 font-medium'>Email</label>
          <input type="text" id="email" {...register("email", { required: true })}
            className='bg-white rounded-lg p-2 w-full outline-none' />
          {errors.email && <span className='text-red-500 text-sm'>email is required</span>}


          <label htmlFor="password" className='block mb-1 font-medium'>password</label>
          <input type="password" id="password" {...register("password", { required: true })}
            className='bg-white rounded-lg p-2 w-full outline-none' />
          {errors.password && <span className='text-red-500 text-sm'>password is required</span>}


          <button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded w-full mt-4'>Login</button>

        </div>
      </form>
    </div>
  )
}

export default Login
