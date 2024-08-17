"use client";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Tabs from "@/components/Tabs";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Login", component: <Login setActiveTab={setActiveTab} /> },
    { title: "Register", component: <Register setActiveTab={setActiveTab} /> },
  ];
  return (
    <main className="gap-16 p-12">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
