"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authContext";

export default function Cart() {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!authUser) {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    }
  }, [authUser, isLoading, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
    </div>
  );
}
