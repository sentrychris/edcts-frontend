// app/auth/callback/page.tsx
import { type FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const CallbackPage: FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/get-token", {
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

        const result = await signIn("credentials", {
          redirect: false,
          token: token,
        });

        if (result?.ok) {
          router.push("/dashboard");
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

export default CallbackPage;
