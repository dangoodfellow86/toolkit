"use client";
import { useState } from "react";
import Link from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { AiFillCalendar } from "react-icons/ai";
import { RiMoneyPoundBoxFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Profile } from "../Auth/Avatar/avatar";

const NavBar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const pathname = usePathname();

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const navItems = [
		{
			name: "Home",
			link: "/Home",
			icon: <AiFillHome />,
		},
		{
			name: "Overtime",
			link: "/Overtime",
			icon: <RiMoneyPoundBoxFill />,
		},
		{
			name: "Leave",
			link: "/Leave",
			icon: <AiFillCalendar />,
		},
	];
	return (
		<>
			{user ? (
				<div className='flex justify-between items-center w-screen h-16 bg-gray-800 text-white py-4 px-2 '>
					<div className='flex items-center '>
						<span className='text-xl font-bold '>MIM Toolkit</span>
					</div>

					<nav className='hidden md:flex space-x-4 justify-center flex-grow'>
						{navItems.map((item, index) => (
							<Link
								key={index}
								href={item.link}
								className={`hover:text-gray-400 p-2 bg-slate-600  hover:rounded-full ${
									pathname === item.link
										? "font-bold border-b-2 border-solid rounded-full"
										: "rounded-md"
								}`}>
								{item.icon}{" "}
							</Link>
						))}
					</nav>
					<div className='items-center justify-end hidden md:block '>
						{user ? <Profile /> : null}
					</div>

					<button
						id='toggleMenu'
						className='md:hidden focus:outline-none'
						onClick={toggleMobileMenu}>
						<AiOutlineMenu className='h-6 w-6' />
					</button>
					<div
						id='mobileMenu'
						className={`fixed inset-0 bg-gray-800  transition-all duration-300 ease-in-out md:hidden ${
							isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
						}`}>
						<div className='absolute inset-0 px-4 py-16 flex flex-col items-center space-y-6 text-center text-white'>
							<div className='flex flex-row p-4 justify-around w-full '>
								<button
									id='toggleMenu'
									className='md:hidden focus:outline-none'
									onClick={toggleMobileMenu}>
									<RxCross1 className='h-6 w-6' />
								</button>
								{user ? <Profile /> : null}
							</div>

							{navItems.map((item, index) => (
								<Link
									key={index}
									href={item.link}
									className='hover:text-gray-400'>
									{item.name}{" "}
								</Link>
							))}
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default NavBar;
