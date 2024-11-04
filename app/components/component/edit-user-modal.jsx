"use client";

import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { editUserModalState } from "@/app/state/atoms/editUserModalState";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import {
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditUserModal() {
	const [modalState, setModalState] = useRecoilState(editUserModalState);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "",
		department: "",
	});

	useEffect(() => {
		if (modalState.userData) {
			setFormData({
				name: modalState.userData.name || "",
				email: modalState.userData.email || "",
				role: modalState.userData.role || "",
				department: modalState.userData.department || "",
			});
		}
	}, [modalState.userData]);

	const handleClose = () => {
		setModalState({ isOpen: false, userData: null });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!modalState.userData?.id) return;

		try {
			const userRef = doc(firestore, "users", modalState.userData.id);
			await updateDoc(userRef, formData);
			handleClose();
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	if (!modalState.isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
			<Card className='w-[500px] max-h-[90vh] overflow-y-auto'>
				<CardHeader>
					<CardTitle>Edit User</CardTitle>
					<CardDescription>Update user information</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='role'>Role</Label>
							<Input
								id='role'
								value={formData.role}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, role: e.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, email: e.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='department'>Department</Label>
							<Input
								id='department'
								value={formData.department}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										department: e.target.value,
									}))
								}
							/>
						</div>
						<div className='flex justify-end space-x-2 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={handleClose}>
								Cancel
							</Button>
							<Button type='submit'>Save Changes</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
