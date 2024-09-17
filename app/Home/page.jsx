"use client";
import { React, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { redirect, useRouter } from "next/navigation";
import Home from "../page";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useRecoilValue } from "recoil";
import { currentMonthOvertimeSelector } from "../state/atoms/selector/currentMonthOvertimeSelector";
const HomePage = () => {
	const [user, loading, error] = useAuthState(auth);
	const [loggedInUser, setLoggedInUser] = useState(null);

	if (!user) {
		redirect("/Login");
	}

	useEffect(() => {
		const fetchUser = async () => {
			if (user) {
				const userDocRef = doc(firestore, "users", user.uid);

				const userDocSnapshot = await getDoc(userDocRef);
				if (userDocSnapshot.exists()) {
					const userData = userDocSnapshot.data();
					setLoggedInUser(userData);
				} else {
					// User document does not exist
				}
			}
		};

		fetchUser();
	}, [user]);

	const currentMouthOT = useRecoilValue(currentMonthOvertimeSelector);

	return (
		<>
			<main className='flex justify-evenly flex-col h-screen '>
				<div className='flex justify-center mt-2 '>
					<h1 className='text-center text-3xl '>Welcome Dan</h1>
				</div>
				<div className='flex justify-center'>
					<HomeCard
						title='Annual / Public / Toil Leave'
						description='Amount of leave remaining is 6 shifts'
						href='/Leave'
					/>
					<HomeCard
						title='Overtime & On Call'
						description={`Amount of overtime claimed this month is £${currentMouthOT}`}
						href='/Overtime'
					/>
				</div>
			</main>
		</>
	);
};

export default HomePage;

function HomeCard({ title, description, href }) {
	return (
		<Card className='m-2'>
			<CardHeader>
				<Link href={href}>
					<CardTitle>{title}</CardTitle>
				</Link>
			</CardHeader>
			<CardContent>
				<p>{description}</p>
			</CardContent>
		</Card>
	);
}
