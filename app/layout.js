import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import NavBar from "./components/navbar/navbar";

import RecoilContextProvider from "./lib/recoilContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "The MIM Toolkit",
	description: "This is a toolkit for managing leave and overtime.",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<RecoilContextProvider>
					<NavBar />

					{children}
				</RecoilContextProvider>
			</body>
		</html>
	);
}
