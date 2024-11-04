"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import ErrorDisplay from "@/app/components/ui/ErrorDisplay";
import Image from "next/image";

export default function UserProfile() {
	const [annualLeave, setAnnualLeave] = useState(20);
	const [publicLeave, setPublicLeave] = useState(10);
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const userDoc = await getDoc(doc(firestore, "users", user.uid));
					if (userDoc.exists()) {
						const data = userDoc.data();
						setUserData(data);
						if (data.annualLeave) setAnnualLeave(data.annualLeave);
						if (data.publicLeave) setPublicLeave(data.publicLeave);
					} else {
						setError("User data not found");
					}
				} catch (err) {
					console.error("Error fetching user data:", err);
					setError("Failed to fetch user data");
				}
			} else {
				setError("No user logged in");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const handleSaveLeave = async () => {
		try {
			const auth = getAuth();
			const currentUser = auth.currentUser;

			if (currentUser) {
				const userRef = doc(firestore, "users", currentUser.uid);
				await updateDoc(userRef, {
					annualLeave,
					publicLeave,
				});
				setIsEditing(false);
			}
		} catch (err) {
			console.error("Error updating leave amounts:", err);
			setError("Failed to update leave amounts");
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-background p-4 md:p-8 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-background p-4 md:p-8 flex items-center justify-center'>
				<ErrorDisplay message={error} />
			</div>
		);
	}

	if (!userData) {
		return (
			<div className='min-h-screen bg-background p-4 md:p-8 flex items-center justify-center'>
				<p className='text-lg text-gray-600'>No user data found.</p>
			</div>
		);
	}
	const calculateTotalLeave = () => {
		return annualLeave + publicLeave;
	};

	const calculateALShift = () => {
		return annualLeave / 10.5;
	};
	const calculatePHShift = () => {
		return publicLeave / 10.5;
	};
	const calculateTotalShift = () => {
		const totalLeave = calculateTotalLeave();
		return totalLeave / 10.5;
	};

	return (
		<div className='min-h-screen bg-background p-4 md:p-8'>
			<Card className='w-full'>
				<CardHeader className='flex flex-col md:flex-row items-center gap-4 md:gap-8'>
					<div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
						{userData.photoURL ? (
							<Image
								src={userData.photoURL}
								alt='User avatar'
								className='w-full h-full object-cover'
							/>
						) : (
							<span className='text-4xl text-gray-600'>
								{`${userData.fName?.[0] || ""}${userData.sName?.[0] || ""}`}
							</span>
						)}
					</div>
					<div className='flex flex-col items-center md:items-start'>
						<CardTitle className='text-3xl md:text-4xl'>
							{`${userData.fName || ""} ${userData.sName || ""}`}
						</CardTitle>
						<CardDescription className='text-lg'>
							{userData.email}
						</CardDescription>
						<div className='flex items-center mt-2'>
							<MapPin className='w-5 h-5 mr-2' />
							<span className='text-base text-muted-foreground'>
								{userData.role || "Role not set"}
							</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					<div className='space-y-4'>
						<div className='flex items-center'>
							<CalendarDays className='w-5 h-5 mr-2' />
							<span className='text-base text-muted-foreground'>
								{userData.department || "Department not set"}
							</span>
						</div>
					</div>
					<div className='space-y-4'>
						<h3 className='text-xl font-semibold'>Leave Balance</h3>
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<Label
									htmlFor='annual-leave'
									className='text-base'>
									Annual Leave:
								</Label>
								{isEditing ? (
									<Input
										id='annual-leave'
										type='number'
										value={annualLeave}
										onChange={(e) => setAnnualLeave(Number(e.target.value))}
										className='w-24'
									/>
								) : (
									<span className='text-base'>
										{annualLeave} Hours / {calculateALShift().toFixed(2)} Shifts
									</span>
								)}
							</div>
							<div className='flex items-center justify-between'>
								<Label
									htmlFor='sick-leave'
									className='text-base'>
									Public Leave:
								</Label>
								{isEditing ? (
									<Input
										id='sick-leave'
										type='number'
										value={publicLeave}
										onChange={(e) => setPublicLeave(Number(e.target.value))}
										className='w-24'
									/>
								) : (
									<span className='text-base'>
										{publicLeave} Hours / {calculatePHShift().toFixed(2)} Shifts
									</span>
								)}
							</div>
							<div className='flex items-center justify-between'>
								<Label
									htmlFor='Total-leave'
									className='text-base'>
									Total Leave :
								</Label>
								<span className='text-base'>
									{" "}
									{calculateTotalLeave().toFixed(2)}Hours /{" "}
									{calculateTotalShift().toFixed(2)} Shifts
								</span>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex flex-wrap justify-end gap-4'>
					{isEditing ? (
						<>
							<Button
								variant='outline'
								size='lg'
								onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
							<Button
								size='lg'
								onClick={handleSaveLeave}>
								Save Leave
							</Button>
						</>
					) : (
						<Button
							size='lg'
							onClick={() => setIsEditing(true)}>
							Update Leave
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
