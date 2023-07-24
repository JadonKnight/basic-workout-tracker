import Link from "next/link";
import {
  CheckIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export default async function Page() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-500 to-indigo-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Track and Improve Your Workouts
          </h1>
          <p className="text-lg mb-8">
            Achieve your fitness goals with our powerful workout tracker.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-md font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="text-blue-200 hover:text-white font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Why Choose Our Workout Tracker?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="md:w-1/3 p-4">
              <CheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simplify your workout tracking process with our intuitive
                interface.
              </p>
            </div>
            <div className="md:w-1/3 p-4">
              <PresentationChartLineIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your progress over time and see how you are improving.
              </p>
            </div>
            <div className="md:w-1/3 p-4">
              <ChartPieIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Insightful Statistics
              </h3>
              <p className="text-gray-600">
                Gain valuable insights from detailed statistics about your
                workouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-b from-blue-500 to-indigo-500 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white mb-8">
            Sign up now and take control of your fitness journey!
          </p>
          <Link
            href="/signup"
            className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-md font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Additional Sections (if needed) */}
      {/* ... */}
    </div>
  );
}
