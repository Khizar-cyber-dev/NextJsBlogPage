'use client';

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
  name: string
  email: string
  password: string
}

type Variant = "SignUp" | "SignIn"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<Variant>("SignIn");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const session = useSession();

  const { register, handleSubmit, formState: { errors } } = useForm<Props>({
    defaultValues: {
      name: '',
      email: '',
    },
    resolver: zodResolver(schema),
  })

   useEffect(() => {
        setMounted(true);
    }, []);

  useEffect(() => {
    if(session.status === "authenticated"){
      router.push('/home');
    }
  },[session.status, router])

  const onSubmit = (data: Props) => {
    setLoading(true);
    if(variant === "SignUp"){
        axios.post('api/register', data)
        .then(() => signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setLoading(false));
    }

    if(variant === "SignIn"){
       signIn('credentials', {
        ...data,
        redirect: false,
       })
       .then((callback) => {
        if(callback?.error){
          toast.error("Invalid credentials");
        }
        if(callback?.ok && !callback?.error){
          toast.success("Logged in successfully");
          router.push('/home');
        }
      })
      .finally(() => setLoading(false));
    }
  }

  if(!mounted){
    return null;
  }
    
  return (
    <div>
      <form 
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {variant === "SignUp" ? "Create an Account" : "Sign In"}
          </h2>
          
          {variant === "SignUp" && (
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              id="name"
              {...register("name")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              id="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button 
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
          <div>
            <button 
              type="button"
              onClick={() => setVariant(variant === "SignUp" ? "SignIn" : "SignUp")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {variant === "SignUp" ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Page