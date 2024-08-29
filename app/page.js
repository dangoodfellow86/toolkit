"use client";
import { React } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

import Login from "../app/components/Auth/Login/login";
import { Button } from "./components/ui/button";
import { RecoilRoot } from "recoil";

export default function Home() {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		const handleRedirect = async () => {
			if (!user && !isRedirecting) {
				setIsRedirecting(true);
				await router.push("/Login");
			} else if (user && router.pathname === "/Login") {
				router.push("/Home");
			}
			handleRedirect();
		};
	}, [user, router, isRedirecting]);

	if (isRedirecting) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<RecoilRoot>
				<Login />
				
			</RecoilRoot>
		</>
	);
}
