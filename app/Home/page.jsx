"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import Home from "../page";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { useRecoilValue } from "recoil";
import { currentMonthOvertimeSelector } from "../state/atoms/selector/currentMonthOvertimeSelector";
const HomePage = () => {
	const currentMouthOT = useRecoilValue(currentMonthOvertimeSelector);
	return (
		<>
			<main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 '>
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
