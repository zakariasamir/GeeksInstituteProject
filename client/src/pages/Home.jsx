import { Link } from 'react-router-dom';
import { FaUserTie, FaBriefcase, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Welcome to GeeksInstitute
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              A comprehensive platform for managing employee portfolios and professional development.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need to manage professional portfolios effectively
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <FaUserTie className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900">
                    Portfolio Management
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Create and manage professional portfolios with ease, showcasing skills and achievements.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <FaUsers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900">
                    Employee Management
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Efficiently manage employee profiles, track progress, and maintain records.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <FaChalkboardTeacher className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900">
                    Professional Development
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Track educational achievements, work experience, and project accomplishments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-600">Start using GeeksInstitute today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}