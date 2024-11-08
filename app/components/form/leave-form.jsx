"use client";
import React, { useEffect, useState } from "react";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import { useRecoilState } from "recoil";
import { leaveFormState } from "@/app/state/atoms/leaveFormState";
import {
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	CardFooter,
	Card,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectContent,
	Select,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

export function LeaveForm() {
	const [date, setDate] = useState("");
	const [type, setType] = useState("");
	const [hours, setHours] = useState(0);
	const [error, setError] = useState(null);

	const [dateCreated, setDateCreated] = useState("");
	const [showForm, setShowForm] = useRecoilState(leaveFormState);
	const [user] = useAuthState(auth);

	const leaveType = [
		{ type: "Select leave type", rate: 0 },
		{ type: "Annual" },
		{ type: "Public" },
		{ type: "Toil" },
	];

	const [selectedLeaveType, setSelectedLeaveType] = useState(leaveType[0]);

	const updateToilLeave = async (userId, hours) => {
		try {
			const userRef = doc(firestore, "users", userId);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				const userData = userDoc.data();
				const currentToilLeave = parseFloat(userData.toilLeave || 0);
				const newToilLeave = currentToilLeave + parseFloat(hours);

				await updateDoc(userRef, {
					toilLeave: Number(newToilLeave.toFixed(2)), // Round to 2 decimal places
				});
			}
		} catch (error) {
			console.error("Error updating toil leave:", error);
			throw error;
		}
	};

	const updatePublicLeave = async (userId, hours) => {
		try {
			const userRef = doc(firestore, "users", userId);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				const userData = userDoc.data();
				const currentPublicLeave = parseFloat(userData.publicLeave || 0);
				const newPublicLeave = currentPublicLeave - parseFloat(hours);

				// Check if there's enough balance
				if (newPublicLeave < 0) {
					throw new Error("Insufficient public leave balance");
				}

				await updateDoc(userRef, {
					publicLeave: Number(newPublicLeave.toFixed(2)), // Round to 2 decimal places
				});
			}
		} catch (error) {
			console.error("Error updating public leave:", error);
			throw error;
		}
	};
	const updateAnnualLeave = async (userId, hours) => {
		try {
			const userRef = doc(firestore, "users", userId);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				const userData = userDoc.data();
				const currentAnnualLeave = parseFloat(userData.annualLeave || 0);
				const newAnnualLeave = currentAnnualLeave - parseFloat(hours);

				// Check if there's enough balance
				if (newAnnualLeave < 0) {
					throw new Error("Insufficient public leave balance");
				}

				await updateDoc(userRef, {
					annualLeave: Number(newAnnualLeave.toFixed(2)), // Round to 2 decimal places
				});
			}
		} catch (error) {
			console.error("Error updating public leave:", error);
			throw error;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		try {
			const formData = {
				date,
				type,
				hours: parseFloat(hours), // Store as float in the leave collection
				dateCreated: new Date().toISOString(),
				userId: user.uid,
				userEmail: user.email,
			};

			// Handle leave balance updates based on type
			if (type === "Toil") {
				await updateToilLeave(user.uid, hours);
			} else if (type === "Public") {
				await updatePublicLeave(user.uid, hours);
			} else if (type === "Annual") {
				await updateAnnualLeave(user.uid, hours);
			}

			// Add leave request to collection
			const docRef = await addDoc(collection(firestore, "leave"), formData);
			console.log("Document written with ID: ", docRef.id);

			// Reset form fields
			setDate("");
			setType("");
			setHours(0);
			setShowForm(false);
		} catch (error) {
			console.error("Error submitting leave request:", error);
			setError(error.message || "Failed to submit leave request");
		}
	};

	const handleSelectChange = (value) => {
		const selectedType = value;
		const foundLeaveType = leaveType.find((type) => type.type === selectedType);
		setType(selectedType);

		if (foundLeaveType) {
			setSelectedLeaveType(foundLeaveType);
		} else {
			console.error("No matching type found");
		}
	};

	if (selectedLeaveType) {
		console.log(selectedLeaveType.rate);
	} else {
		console.log("selectedLeaveType is undefined");
	}

	return (
		<>
			{showForm ? (
				<div
					key='1'
					className='fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50'>
					<div />
					<div className='flex items-center justify-center'>
						<Card className='w-[calc(100vw-1rem)] max-w-sm'>
							<CardHeader className='p-6'>
								<CardTitle>Log leave</CardTitle>
								<CardDescription>
									Submit your leave hours for compensation.
								</CardDescription>
							</CardHeader>
							<CardContent className='p-6'>
								<div className='space-y-4'>
									{error && <div className='text-red-500 text-sm'>{error}</div>}
									<div className='grid grid-cols-1 gap-4'>
										<div className='flex flex-col space-y-1.5'>
											<Label htmlFor='date'>Date</Label>
											<Input
												required
												id='date'
												type='date'
												value={date}
												onChange={(e) => setDate(e.target.value)}
											/>
										</div>
										<div className='flex flex-col space-y-1.5'>
											<Label htmlFor='type'>Type</Label>
											<Select
												onValueChange={(value) => {
													handleSelectChange(value);
												}}
												defaultValue={type}>
												<SelectTrigger id='type'>
													<SelectValue placeholder='Select leave' />
												</SelectTrigger>
												<SelectContent>
													{leaveType.map((type) => (
														<SelectItem
															key={type.type}
															value={type.type}>
															{type.type}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className='flex flex-col space-y-1.5'>
											<Label htmlFor='hours'>Hours</Label>
											<Input
												id='hours'
												type='number'
												step='0.1' // Allow decimal inputs
												placeholder='Enter hours'
												value={hours}
												onChange={(e) => setHours(Number(e.target.value))}
											/>
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className='flex justify-end gap-2 p-6'>
								<Button
									variant='outline'
									onClick={() => setShowForm(false)}>
									Cancel
								</Button>
								<Button onClick={handleSubmit}>Submit</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			) : null}
		</>
	);
}
