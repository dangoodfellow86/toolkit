import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "@/app/firebase";
import Link from "next/link";

export function Profile() {
	const [user] = useAuthState(auth);
	const [initial, setInitial] = useState("");
	const router = useRouter();

	const handleLogout = () => {
		auth.signOut();
		router.push("/Login");
	};

	useEffect(() => {
		const fetchUser = async () => {
			const userDoc = await getDoc(doc(firestore, "users", user.uid));
			if (userDoc.exists()) {
				const userData = userDoc.data();
				const initial = userData.inital || "";
				setInitial(initial);
			}
		};

		fetchUser();
	}, [user.uid]);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='h-9 w-9'>
					<AvatarImage
						alt='@shadcn'
						src='/placeholder-avatar.jpg'
					/>
					<AvatarFallback>{initial}</AvatarFallback>
					<span className='sr-only'>Toggle user menu</span>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<Link href='/AccountDetails'>
					<DropdownMenuItem>Account Details</DropdownMenuItem>
				</Link>
				<DropdownMenuItem>
					<Button onClick={handleLogout}>Logout</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
