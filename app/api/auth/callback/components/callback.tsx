"use client";

import { type FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const AuthCallback: FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost/api/auth/frontier/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        const { token } = data;

        const result = await signIn("credentials", {
          redirect: false,
          token: token,
        });

        if (result?.ok) {
          router.push("/");
        } else {
          console.error("Sign-in failed:", result?.error);
          // Optionally redirect to an error page
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Optionally redirect to an error page
      }
    };

    fetchUser();
  }, [router]);

  return <div>Loading...</div>;
};

export default AuthCallback;
