"use client";

import { type FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const AuthCallback: FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Directly fetch the token from the Laravel backend
        const response = await fetch("http://localhost/api/auth/frontier/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        const { token } = data;

        console.log({ data });

        const result = await signIn("credentials", {
          redirect: false,
          token: token,
        });

        console.log({ result });

        if (result?.ok) {
          router.push("/");
        } else {
          console.error("Sign-in failed:", result?.error);
          // Optionally redirect to an error page
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        // Optionally redirect to an error page
      }
    };

    fetchToken();
  }, [router]);

  return <div>Loading...</div>;
};

export default AuthCallback;
