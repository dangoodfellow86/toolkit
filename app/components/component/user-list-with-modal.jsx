"use client";

import { useSetRecoilState } from "recoil";
import { editUserModalState } from "@/app/state/atoms/editUserModalState";
import { UserList } from "./user-list";
import { EditUserModal } from "./edit-user-modal";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";

export function UserListWithModal() {
	const setModalState = useSetRecoilState(editUserModalState);

	// Function to fetch user data from Firestore
	const fetchUserData = async (userId) => {
		try {
			const userDoc = await getDoc(doc(firestore, "users", userId));
			if (userDoc.exists()) {
				const userData = {
					id: userDoc.id,
					...userDoc.data(),
				};
				setModalState({ isOpen: true, userData });
			} else {
				console.error("User document not found");
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	// Intercept the window event for edit button clicks
	if (typeof window !== "undefined") {
		window.addEventListener("click", (e) => {
			if (
				e.target.closest("button")?.querySelector(".sr-only")?.textContent ===
				"Edit"
			) {
				const row = e.target.closest("tr");
				if (row) {
					const userId = row.getAttribute("data-id");
					if (userId) {
						fetchUserData(userId);
					}
				}
			}
		});
	}

	return (
		<>
			<UserList />
			<EditUserModal />
		</>
	);
}
