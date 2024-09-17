"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import ErrorDisplay from "@/app/components/ui/ErrorDisplay";

const AuthWrapper = ({ children }) => {
	const [user, loading, error] = useAuthState(auth);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorDisplay message={error.message} />;
	}

	return <>{children}</>;
};

export default AuthWrapper;
