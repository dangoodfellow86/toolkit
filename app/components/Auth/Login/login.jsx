"use client";
import { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import Link from "next/link";
import { Button } from "../../ui/button";
import { useAuth } from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase"; // Assuming you have a firebase.js file with the firebase configuration
import { useRouter } from "next/navigation";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [signInWithEmailAndPassword, user, loading, error] =
		useSignInWithEmailAndPassword(auth);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(email, password);
			router.push("/Home");
		} catch (error) {
			// Handle login error
			console.log(error);
		}
	};

	return (
		<div className='flex items-center min-h-screen px-6'>
			<div className='w-full max-w-sm space-y-4 mx-auto'>
				<div className='space-y-2 text-center'>
					<h1 className='text-3xl font-bold'>The Toolkit</h1>
					<h1 className='text-3xl font-bold'>Login</h1>
					<p className='text-gray-500'>
						Enter your email below to login to your account
					</p>
				</div>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							placeholder='m@example.com'
							required
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center'>
							<Label htmlFor='password'>Password</Label>
							<Link
								className='ml-auto inline-block text-sm underline'
								href='#'>
								Forgot your password?
							</Link>
						</div>
						<Input
							id='password'
							required
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Button
						className='w-full'
						onClick={handleLogin}>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}
