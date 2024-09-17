"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import Login from "../app/components/Auth/Login/login";
import { RecoilRoot } from "recoil";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import ErrorDisplay from "@/app/components/ui/ErrorDisplay";
import { redirect } from "next/navigation";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
	
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (!user) {
    return (
      <RecoilRoot>
        <Login />
      </RecoilRoot>
    );
  }

  if(user) {
	redirect("/Home")
  }

  return (
    <RecoilRoot>
      {/* Render your authenticated app content here */}
      <h1>Welcome, {user.displayName}!</h1>
      {/* Add more components for the authenticated home page */}
    </RecoilRoot>
  );
}
