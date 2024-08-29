"use client";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/app/firebase"; // Replace './firebase' with the path to your Firebase configuration file

import {
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	Card,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
	TableBody,
	Table,
} from "@/app/components/ui/table";
import { useRecoilState } from "recoil";
import { userFormState } from "@/app/state/atoms/userFormState";

export function UserList() {
	const [showForm, setShowForm] = useRecoilState(userFormState);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const usersCollectionRef = collection(firestore, "users");

		const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
			const userList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(userList);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);

	const handleDelete = async (id) => {
		// Delete overtime record from firestore
		try {
			await deleteDoc(doc(firestore, "users", id));
			const newUsers = users.filter((overtime) => overtime.id !== id);
			setUsers(newUsers);
		} catch (error) {
			console.error("Error deleting document: ", error);
		}
	};

	const handleForm = () => {
		setShowForm(true);
	};

	return (
		<div className='flex flex-col w-full p-4 gap-4'>
			<Card>
				<CardHeader className='flex flex-col md:flex-row md:items-start md:gap-4'>
					<div className='flex flex-col'>
						<CardTitle className='text-lg'>Users</CardTitle>
						<CardDescription>
							View and manage Users of the application
						</CardDescription>
					</div>
					<div className='flex flex-col md:ml-auto lg:flex-row lg:ml-auto xl:flex-row xl:ml-auto 2xl:flex-row 2xl:ml-auto gap-2'>
						<Button
							onClick={handleForm}
							variant='outline'
							size='sm'>
							Add User
						</Button>
					</div>
				</CardHeader>
				<CardContent className='p-0'>
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-[150px]'>Role</TableHead>
									<TableHead>First Name</TableHead>
									<TableHead>Second Name</TableHead>
									<TableHead className='w-[100px]'>Email</TableHead>

									<TableHead className='w-[100px]'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell className='font-medium'>{user.role}</TableCell>
										<TableCell>{user.fName}</TableCell>
										<TableCell>{user.sName}</TableCell>
										<TableCell>{user.email}</TableCell>

										<TableCell className='flex gap-2 w-[100px]'>
											<Button
												className='w-6 h-6'
												size='icon'
												variant='outline'>
												<FileEditIcon className='w-4 h-4' />
												<span className='sr-only'>Edit</span>
											</Button>
											<Button
												onClick={() => handleDelete(overtime.id)}
												className='w-6 h-6'
												size='icon'
												variant='outline'>
												<TrashIcon className='w-4 h-4' />
												<span className='sr-only'>Delete</span>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function FileEditIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5' />
			<polyline points='14 2 14 8 20 8' />
			<path d='M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z' />
		</svg>
	);
}

function TrashIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M3 6h18' />
			<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
			<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
		</svg>
	);
}
