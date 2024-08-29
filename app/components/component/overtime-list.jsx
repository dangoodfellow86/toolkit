/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/oXLa5otNWJA
 */
"use client";
import { useState, useEffect } from "react";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
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
import { otFormState } from "@/app/state/atoms/otFormState";
import { overtimeListValue } from "@/app/state/atoms/overtimeListValue";
import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function OvertimeList() {
	const [showForm, setShowForm] = useRecoilState(otFormState);
	const [overtimes, setOvertimes] = useRecoilState(overtimeListValue);
	const [user] = useAuthState(auth);

	const calculateTotalOvertime = () => {
		let totalOvertime = 0;
		overtimes.forEach((overtime) => {
			totalOvertime += overtime.amount;
		});
		return totalOvertime;
	};

	console.log(calculateTotalOvertime());

	const month = new Date().toLocaleString("default", { month: "long" });
	console.log(month);
	const currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth() + 1);
	const nextMonth = currentDate.toLocaleString("default", {
		month: "long",
	});
	console.log(nextMonth);
	currentDate.setMonth(currentDate.getMonth() - 2);
	const previousMonth = currentDate.toLocaleString("default", {
		month: "long",
	});
	console.log(previousMonth);
	const calculateTotalOvertimeByMonth = (month) => {
		let totalOvertime = 0;
		overtimes.forEach((overtime) => {
			const overtimeMonth = new Date(overtime.date).toLocaleString("default", {
				month: "long",
			});
			if (overtimeMonth === month) {
				totalOvertime += overtime.amount;
			}
		});
		return totalOvertime;
	};

	console.log(calculateTotalOvertimeByMonth(month));
	console.log(calculateTotalOvertimeByMonth(nextMonth));
	console.log(calculateTotalOvertimeByMonth(previousMonth));

	const handleDelete = async (id) => {
		// Delete overtime record from firestore
		try {
			await deleteDoc(doc(firestore, "overtime", id));
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
						<CardTitle className='text-lg'>Overtime Records</CardTitle>
						<CardDescription>
							View and manage overtime records for your employees
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
									<TableHead className='w-[100px]'>Amount</TableHead>
									<TableHead className='w-[100px]'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{overtimes.map((overtime) => (
									<TableRow key={overtime.id}>
										<TableCell className='font-medium'>
											{overtime.type}
										</TableCell>
										<TableCell>
											{new Date(overtime.date).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</TableCell>
										<TableCell>
											{new Date(overtime.dateCreated).toLocaleDateString(
												"en-GB",
												{ day: "2-digit", month: "2-digit", year: "numeric" }
											)}
										</TableCell>
										<TableCell>{overtime.hours}</TableCell>
										<TableCell>£{overtime.amount.toFixed(2)}</TableCell>
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
