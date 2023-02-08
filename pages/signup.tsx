import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Router from "next/router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const { status } = useSession();

  // Empty div for loading
  if (status === "loading") return <div></div>;

  if (status === "authenticated") {
    Router.push("/");
    return <div></div>;
  }

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

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
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
      // If user already exists, display an error
      setUserErrorMessage("User already exists");
    } else {
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

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
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
                  <div className="text-red-500 text-sm">{userErrorMessage}</div>
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
                <div className=" relative ">
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
                    <div className="mt-2 text-red-500">
                      Password must be at least 8 characters
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-full my-4">
                <button
                  type="submit"
                  className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none "
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
