import type { FunctionComponent } from "react";
import AuthCallback from "./components/callback";
import { cookies } from "next/headers";

const CallbackPage: FunctionComponent = () => {
  const csrf = cookies().get("next-auth.csrf-token")?.value.split("|")[0] as string;
  return <AuthCallback csrf={csrf} />;
};

export default CallbackPage;
