"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";

export default function UserProfile() {
	const [annualLeave, setAnnualLeave] = useState(20);
	const [sickLeave, setSickLeave] = useState(10);
	const [isEditing, setIsEditing] = useState(false);

	const handleSaveLeave = () => {
		console.log("Saving leave amounts:", { annualLeave, sickLeave });
		setIsEditing(false);
	};

	return (
		<div className='min-h-screen bg-background p-4 md:p-8'>
			<Card className='w-full'>
				<CardHeader className='flex flex-col md:flex-row items-center gap-4 md:gap-8'>
					<Avatar className='w-32 h-32'>
						<AvatarImage
							alt='User avatar'
							src='/placeholder.svg?height=128&width=128'
						/>
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<div className='flex flex-col items-center md:items-start'>
						<CardTitle className='text-3xl md:text-4xl'>Jane Doe</CardTitle>
						<CardDescription className='text-lg'>@janedoe</CardDescription>
						<div className='flex items-center mt-2'>
							<MapPin className='w-5 h-5 mr-2' />
							<span className='text-base text-muted-foreground'>
								San Francisco, CA
							</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					<div className='space-y-4'>
						<div className='flex items-center'>
							<CalendarDays className='w-5 h-5 mr-2' />
							<span className='text-base text-muted-foreground'>
								Joined March 2020
							</span>
						</div>
						<div className='flex items-center'>
							<LinkIcon className='w-5 h-5 mr-2' />
							<a
								href='https://janedoe.com'
								className='text-base text-primary hover:underline'>
								janedoe.com
							</a>
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
									<span className='text-base'>{annualLeave} days</span>
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
										value={sickLeave}
										onChange={(e) => setSickLeave(Number(e.target.value))}
										className='w-24'
									/>
								) : (
									<span className='text-base'>{sickLeave} days</span>
								)}
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex flex-wrap justify-between gap-4'>
					<Button size='lg'>Message</Button>
					<Button size='lg'>Follow</Button>
					{isEditing ? (
						<Button
							size='lg'
							onClick={handleSaveLeave}>
							Save Leave
						</Button>
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
