"use client";
import React from "react";
import { OvertimeList } from "../components/component/overtime-list";

import { OvertimeForm } from "../components/form/overtime-form";
import { Card, CardTitle } from "../components/ui/card";
import { useRecoilValue } from "recoil";
import { currentMonthOvertimeSelector } from "../state/atoms/selector/currentMonthOvertimeSelector";
import { nextMonthOvertimeSelector } from "../state/atoms/selector/nextMonthOvertimeSelector";
import { previousMonthOvertimeSelector } from "../state/atoms/selector/previousMonthOvertimeSelector";

const OvertimePage = () => {
	const currentMouthOT = useRecoilValue(currentMonthOvertimeSelector);
	const nextMouthOT = useRecoilValue(nextMonthOvertimeSelector);
	const previousMouthOT = useRecoilValue(previousMonthOvertimeSelector);

	console.log(currentMouthOT);

	return (
		<>
			<div className='flex justify-center flex-wrap'>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Last month Overtime</CardTitle>
						<CardTitle>£{previousMouthOT}</CardTitle>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>This month Overtime</CardTitle>
						<CardTitle>£{currentMouthOT}</CardTitle>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Next month Overtime</CardTitle>
						<CardTitle>£{nextMouthOT}</CardTitle>
					</Card>
				</div>
			</div>
			<OvertimeForm />
			<OvertimeList />
		</>
	);
};

export default OvertimePage;
