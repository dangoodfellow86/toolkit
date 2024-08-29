import React from "react";
import { LeaveForm } from "../components/form/leave-form";
import { LeaveList } from "../components/component/leave-list";
import { Card, CardTitle, CardHeader } from "../components/ui/card";

const Leave = () => {
	return (
		<>
			<div className='flex justify-center flex-wrap'>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Toil Leave</CardTitle>
						<CardHeader>20 Hours remaining</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Public Leave</CardTitle>
						<CardHeader>40 hours remaining</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Annual Leave</CardTitle>
						<CardHeader>30 hours remaining</CardHeader>
					</Card>
				</div>
				<div>
					<Card className={"text-center p-4 m-4 shadow-lg text-lg"}>
						<CardTitle>Total Leave</CardTitle>
						<CardHeader>30 hours remaining</CardHeader>
					</Card>
				</div>
			</div>
			<LeaveForm />
			<LeaveList />
		</>
	);
};

export default Leave;
