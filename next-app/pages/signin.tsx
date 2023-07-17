import Link from "next/link";
import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<{ value: string }>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<{ value: string }>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signInAttempt = (await signIn("credentials", {
      redirect: false,
      username,
      password,
    })) as SignInResponse;

    if (signInAttempt.ok) {
      router.push("/dashboard");
    } else {
      // Wipe the password field
      setPassword("");
      setInvalidCredentials(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
          <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
            Welcome Back
          </div>
          <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
            Don&apos;t have an account?
          </span>
          <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
            <Link
              href="/signup"
              className="text-sm text-blue-500 underline hover:text-blue-700"
            >
              Sign up now.
            </Link>
          </span>
          <div className="p-6 mt-8">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col mb-2">
                <div className="relative">
                  <input
                    type="text"
                    id="account-username"
                    className={
                      "rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    }
                    placeholder="Username"
                    onChange={handleUsernameChange}
                    value={username}
                  />
                </div>
              </div>
              <div className="flex flex-col mb-2">
                <div className=" relative ">
                  <input
                    type="password"
                    id="account-password"
                    className={
                      "rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    }
                    name="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                    value={password}
                  />
                </div>
              </div>
              <div className="flex w-full my-4">
                <button
                  type="submit"
                  className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none "
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          {invalidCredentials && (
            <div className="flex justify-center mb-2">
              <span className="text-red-500">
                Invalid username or password.
              </span>
            </div>
          )}
          {/* Home */}
          <div className="flex justify-center mb-2">
            <Link className="text-blue-500 underline hover:text-blue-700" href="/">Home Page</Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Check if user is logged in
// If logged in, redirect to dashboard
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session | null }>> {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
