"use client";
import { useState, useEffect } from "react";
import {
	query,
	collection,
	deleteDoc,
	doc,
	where,
	onSnapshot,
} from "firebase/firestore";
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
import { leaveFormState } from "@/app/state/atoms/leaveFormState";

import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function LeaveList() {
	const [showForm, setShowForm] = useRecoilState(leaveFormState);
	const [leaveList, setLeaveList] = useState([]);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const leaveCollectionref = query(
			collection(firestore, "leave"),
			where("userId", "==", user.uid)
		);
		const unsubscribe = onSnapshot(leaveCollectionref, (snapshot) => {
			const dbCall = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setLeaveList(dbCall);
		});

		// Cleanup function to unsubscribe when the component unmounts
		return () => unsubscribe();
	}, []);
	const calculateTotalHours = () => {
		let totalHours = 0;
		leaveList.forEach((leave) => {
			totalHours += leave.hours;
		});
		return totalHours;
	};
	console.log(calculateTotalHours());
	const handleDelete = async (id) => {
		// Delete overtime record from firestore
		try {
			await deleteDoc(doc(firestore, "leave", id));
			const newOvertimes = overtimes.filter((overtime) => overtime.id !== id);
			setOvertimes(newOvertimes);
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
						<CardTitle className='text-lg'>Leave Records</CardTitle>
						<CardDescription>
							View and manage Leave records for your employees
						</CardDescription>
					</div>
					<div className='flex flex-col md:ml-auto lg:flex-row lg:ml-auto xl:flex-row xl:ml-auto 2xl:flex-row 2xl:ml-auto gap-2'>
						<Button
							onClick={handleForm}
							variant='outline'
							size='sm'>
							Add Record
						</Button>
					</div>
				</CardHeader>
				<CardContent className='p-0'>
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-[150px]'>Type</TableHead>
									<TableHead>Date (dd mm yyyy)</TableHead>
									<TableHead>Date Created (dd mm yyyy)</TableHead>
									<TableHead className='w-[100px]'>Hours</TableHead>

									<TableHead className='w-[100px]'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leaveList.map((leave) => (
									<TableRow key={leave.id}>
										<TableCell className='font-medium'>{leave.type}</TableCell>
										<TableCell>
											{new Date(leave.date).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</TableCell>
										<TableCell>
											{new Date(leave.dateCreated).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</TableCell>
										<TableCell>{leave.hours}</TableCell>

										<TableCell className='flex gap-2 w-[100px]'>
											<Button
												className='w-6 h-6'
												size='icon'
												variant='outline'>
												<FileEditIcon className='w-4 h-4' />
												<span className='sr-only'>Edit</span>
											</Button>
											<Button
												onClick={() => handleDelete(leave.id)}
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
