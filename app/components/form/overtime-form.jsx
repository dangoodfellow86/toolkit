"use client";
import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase"; // Replace './firebase' with the path to your Firebase configuration file
import { useRecoilState } from "recoil";
import { otFormState } from "@/app/state/atoms/otFormState";
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

export function OvertimeForm() {
	const [date, setDate] = useState("");
	const [type, setType] = useState("");
	const [hours, setHours] = useState("");
	const [amount, setAmount] = useState(0);
	const [dateCreated, setDateCreated] = useState("");
	const [showForm, setShowForm] = useRecoilState(otFormState);
	const [user] = useAuthState(auth);

	const overtimeType = [
		{ type: "Select Overtime type", rate: 0 },
		{ type: "Regular", rate: 1 },
		{ type: "Holiday", rate: 2 },
		{ type: "Weekend", rate: 1.5 },
		{ type: "On Call", rate: 1 },
	];

	const [selectedOvertimeType, setSelectedOvertimeType] = useState(
		overtimeType[0]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Add form data to firestore
		try {
			const formData = {
				date,
				type,
				hours,
				amount,
				dateCreated: new Date().toISOString(),
				userId: user.uid,
				userEmail: user.email,
			};

			const docRef = await addDoc(collection(firestore, "overtime"), formData);
			console.log("Document written with ID: ", docRef.id);

			// Reset form fields
			setDate("");
			setType("");
			setHours("");
			setShowForm(false);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	};
	// Handle the case where find returns undefined
	const handleSelectChange = (value) => {
		const selectedType = value;
		const foundOvertimeType = overtimeType.find(
			(type) => type.type === selectedType
		);
		setType(selectedType);

		if (foundOvertimeType) {
			setSelectedOvertimeType(foundOvertimeType);
		} else {
			// Handle the case where no matching type was found
			console.error("No matching type found");
		}
	};
	// Check if selectedOvertimeType is defined before accessing its rate property
	if (selectedOvertimeType) {
		console.log(selectedOvertimeType.rate);
	} else {
		console.log("selectedOvertimeType is undefined");
	}
	useEffect(() => {
		if (selectedOvertimeType.type === "On Call") {
			const baseAmount = parseFloat(hours) * 1;
			const overtimeAmount = baseAmount * selectedOvertimeType.rate;
			setAmount(overtimeAmount);
		} else {
			const baseAmount = parseFloat(hours) * 23.75;
			const overtimeAmount = baseAmount * selectedOvertimeType.rate;
			setAmount(overtimeAmount);
		}
	}, [hours, selectedOvertimeType.rate, selectedOvertimeType.type]);

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
								<CardTitle>Log overtime</CardTitle>
								<CardDescription>
									Submit your overtime hours for compensation.
								</CardDescription>
							</CardHeader>
							<CardContent className='p-6'>
								<div className='space-y-4'>
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
													<SelectValue placeholder='Select Overtime' />
												</SelectTrigger>
												<SelectContent>
													{overtimeType.map((type) => (
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
												placeholder='Enter hours'
												value={hours}
												onChange={(e) => setHours(e.target.value)}
											/>
										</div>
										<div className='flex flex-col space-y-1.5'>
											<Label htmlFor='amount'>Amount of Overtime</Label>
											<Input
												id='amount'
												placeholder={`£${0}`}
												value={`£${isNaN(amount) ? "0" : amount}`}
												onChange={(e) => setAmount(e.target.value)}
												disabled
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
