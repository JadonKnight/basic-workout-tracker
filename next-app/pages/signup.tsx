import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import z from "zod";

import type { GetServerSidePropsContext } from "next";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if username is valid
    if (username.length < 3 || username.length > 20) {
      setUserErrorMessage("Username must be between 3 and 20 characters");
      return;
    }

    // Check if password is valid
    if (password.length < 8) {
      setInvalidPassword(true);
      return;
    }

    // Check if email is valid
    const emailSchema = z.string().email();
    if (!emailSchema.safeParse(email).success) {
      setInvalidEmail(true);
      return;
    }

    setUserErrorMessage("");
    setInvalidPassword(false);
    setInvalidEmail(false);
    setSigningUp(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });

    // Attempt to sign in the user
    if (res.status === 201) {
      // If user was created successfully then sign them in - will currently handle failed attempts through nextauth
      signIn("credentials", {
        username,
        password,
        callbackUrl: "/",
      });
    } else if (res.status === 409) {
      // Username or email already exists
      setUserErrorMessage("This username or email is already in use");
      setSigningUp(false);
    } else {
      setSigningUp(false);
      // Otherwise, alert an error and then redirect to the home page
      const { error } = await res.json();
      alert(`Error: ${error}`);
      window.location.href = "/";
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<{ value: string }>) => {
    setUserErrorMessage("");
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<{ value: string }>) => {
    setInvalidPassword(false);
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<{ value: string }>) => {
    setInvalidEmail(false);
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow-lg shadow-slate-500 dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
          <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
            Create a new account
          </div>
          <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
            Already have an account ?
          </span>
          <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
            <Link
              href="/signin"
              className="text-sm text-blue-500 underline hover:text-blue-700"
            >
              Sign in.
            </Link>
          </span>
          <div className="p-6 mt-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-2">
                {userErrorMessage && (
                  <div className="text-red-500 text-sm my-2">
                    {userErrorMessage}
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    id="create-account-username"
                    className={`rounded-lg border-transparent ${
                      userErrorMessage ? "ring-red-600 ring-2" : ""
                    } flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-${
                      userErrorMessage ? "red" : "purple"
                    }-600 focus:border-transparent`}
                    placeholder="Username"
                    onChange={handleUsernameChange}
                  />
                </div>
              </div>
              <div className="flex flex-col mb-2">
                <div className="relative ">
                  <input
                    type="password"
                    id="create-account-password"
                    className={`rounded-lg border-transparent ${
                      invalidPassword ? "ring-red-600 ring-2" : ""
                    } flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-${
                      invalidPassword ? "red" : "purple"
                    }-600 focus:border-transparent`}
                    name="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                  />
                  {/* If I wanted a password meter
                   <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3">
                    <div className="h-full col-span-3 bg-gray-200 rounded dark:bg-dark-1"></div>
                    <div className="h-full col-span-3 bg-gray-200 rounded dark:bg-dark-1"></div>
                    <div className="h-full col-span-3 bg-gray-200 rounded dark:bg-dark-1"></div>
                    <div className="h-full col-span-3 bg-gray-200 rounded dark:bg-dark-1"></div>
                  </div> */}
                  {invalidPassword && (
                    <div className="my-2 text-red-500">
                      Password must be at least 8 characters
                    </div>
                  )}
                </div>
              </div>
              {/* Email field */}
              <div className="flex flex-col mb-2">
                <div className="relative ">
                  <input
                    type="email"
                    id="create-account-email"
                    className={`rounded-lg border-transparent ${
                      invalidEmail ? "ring-red-600 ring-2" : ""
                    } flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-${
                      invalidEmail ? "red" : "purple"
                    }-600 focus:border-transparent`}
                    name="email"
                    placeholder="Email"
                    onChange={handleEmailChange}
                  />
                  {invalidEmail && (
                    <div className="my-2 text-red-500">
                      Please enter a valid email
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-full my-4">
                <button
                  type="submit"
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none "
                >
                  <div className="flex items-center justify-center">
                    Sign up
                    {signingUp && (
                      <div
                        className="ml-2 flex h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
          {/* Home */}
          <div className="flex justify-center mb-2">
            <Link
              className="text-blue-500 underline hover:text-blue-700"
              href="/"
            >
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Check if user is logged in
// If logged in, redirect to dashboard
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
