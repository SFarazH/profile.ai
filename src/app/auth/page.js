"use client";
import { useAuth } from "@/components/authContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Tabs from "@/components/Tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { authUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Login", component: <Login setActiveTab={setActiveTab} /> },
    { title: "Register", component: <Register setActiveTab={setActiveTab} /> },
  ];

  useEffect(() => {
    authUser != null && router.push("/");
  }, []);

  return (
    <main className="p-4 gap-4 md:p-12 flex flex-col md:flex-row w-full bg-transparent">
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <p className="text-6xl md:text-8xl font-bold">Welcome to Profile.ai</p>
      </div>
      <div className="w-full md:w-1/2">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </main>
  );
}
