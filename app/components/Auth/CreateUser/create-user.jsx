"use client";
import {
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	CardFooter,
	Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectContent,
	Select,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
// import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { useEffect, useState } from "react";

import { firestore } from "@/app/firebase"; // Replace './firebase' with the path to your Firebase configuration file
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userFormState } from "@/app/state/atoms/userFormState";

export function CreateUser() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fName, setFName] = useState("");
	const [sName, setSName] = useState("");
	const [role, setRole] = useState("");
	const [inital, setInitial] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showForm, setShowForm] = useRecoilState(userFormState);

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			await setDoc(doc(firestore, "users", user.uid), {
				fName,
				sName,
				email,
				role,
				inital,
			});
			alert("Account created successfully");
			setFName("");
			setSName("");
			setRole("");
			setInitial("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setPasswordError("");
		} catch (error) {
			// Handle registration error
			console.log(error);
			alert("An error occurred while creating the account");
		}
		setShowForm(false);
	};
	useEffect(() => {
		const ini = fName[0] + sName[0];
		setInitial(ini);
		console.log(fName[0], sName[0], inital);
	}, [fName, sName]);
	return (
		<>
			{showForm ? (
				<div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white rounded-lg p-6 w-full max-w-lg'>
						<Card className='w-full'>
							<CardHeader>
								<CardTitle className='text-2xl'>Create User</CardTitle>
								<CardDescription>
									Enter the user&apos;s information to create their account
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>First Name</Label>
									<Input
										id='fname'
										placeholder='Enter the first name'
										required
										type='text'
										onChange={(e) => setFName(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='name'>Second Name</Label>
									<Input
										id='sname'
										placeholder='Enter the second name'
										required
										type='text'
										onChange={(e) => setSName(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='initial'>initial</Label>
									<Input
										id='Initial'
										placeholder='Initial'
										value={inital}
										required
										type='text'
										disabled
										onChange={(e) => setInitial(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										placeholder='Enter the email'
										required
										type='email'
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										placeholder='Enter the password'
										required
										type='password'
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor=' Confirm password'>Confirm Password</Label>
									<Input
										id='confirmPassword'
										placeholder='Confirm password'
										required
										type='password'
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='role'>Role</Label>
									<Select
										className='w-full'
										id='role'
										onValueChange={(value) => setRole(value)}>
										<SelectTrigger>
											<SelectValue placeholder='Select a role' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='admin'>Admin</SelectItem>
											<SelectItem value='user'>User</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
							<CardFooter className='flex justify-between'>
								<Button
									variant='outline'
									onClick={() => setShowForm(false)}>
									Cancel
								</Button>
								<Button
									className='w-1/2'
									type='submit'
									onClick={handleRegister}>
									Create
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			) : null}
		</>
	);
}
