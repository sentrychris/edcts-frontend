"use client";

import { type FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { settings } from "@/core/config";

const AuthCallback: FunctionComponent<{ csrf: string }> = ({ csrf }) => {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${settings.api.url}/auth/frontier/me`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const { data } = await response.json();
        const { user, token } = data;
        // TODO error handling, ensure user and token are present

        const result = await signIn("credentials", {
          redirect: false,
          user: JSON.stringify(user),
          token: token,
          csrfToken: csrf,
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
