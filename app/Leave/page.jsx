"use client";
import { useState, useEffect } from "react";
import { LeaveForm } from "../components/form/leave-form";
import { LeaveList } from "../components/component/leave-list";
import { Card, CardTitle, CardHeader } from "../components/ui/card";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import ErrorDisplay from "@/app/components/ui/ErrorDisplay";

const Leave = () => {
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

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<ErrorDisplay message={error} />
			</div>
		);
	}

	const toilLeave = userData?.toilLeave || 0;
	const publicLeave = userData?.publicLeave || 0;
	const annualLeave = userData?.annualLeave || 0;
	const totalLeave = toilLeave + publicLeave + annualLeave;

	const calculateALShift = () => {
		return annualLeave / 10.5;
	};
	const calculatePHShift = () => {
		return publicLeave / 10.5;
	};
	const calculateTotalShift = () => {
		return totalLeave / 10.5;
	};
	return (
		<>
			<div className='flex justify-center flex-wrap'>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Toil Leave</CardTitle>
						<CardHeader>{toilLeave} Hours remaining</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Public Leave</CardTitle>
						<CardHeader>{publicLeave} hours remaining</CardHeader>
						<CardHeader className={"mt-0"}>
							{calculatePHShift().toFixed(2)} Shifts remaining
						</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Annual Leave</CardTitle>
						<CardHeader>{annualLeave} hours remaining</CardHeader>
						<CardHeader>
							{calculateALShift().toFixed(2)} hours remaining
						</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Total Leave</CardTitle>
						<CardHeader>{totalLeave} hours remaining</CardHeader>
						<CardHeader>
							{calculateTotalShift().toFixed(2)} hours remaining
						</CardHeader>
					</Card>
				</div>
			</div>
			<LeaveForm />
			<LeaveList />
		</>
	);
};

export default Leave;
