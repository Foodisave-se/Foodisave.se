import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authStore from "../store/authStore";

export default function DashboardUserPage() {
  const { userId } = useParams();
  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const token = authStore((state) => state.token);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status badge colors
  const statusColors = {
    enrolled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    dropped: "bg-red-100 text-red-800",
  };

  async function fetchUserDetail() {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/general/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Could not load user details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <Link
            to="/dashboard/users"
            className="text-blue-600 underline mt-4 block"
          >
            Back to users list
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-yellow-100 p-4 rounded-md">
          <p className="text-yellow-700">User not found.</p>
          <Link
            to="/dashboard/users"
            className="text-blue-600 underline mt-4 block"
          >
            Back to users list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-6">
        <Link to="/dashboard/users" className="text-blue-600 hover:underline">
          ← Back to Users List
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* User Basic Info Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold 
                    ${
                      user.is_superuser
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
              >
                {user.is_superuser ? "Admin" : "User"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold 
                    ${
                      user.disabled
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
              >
                {user.disabled ? "Inactive" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="mt-1 text-sm text-gray-900">{user.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Created
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            {user.company_id && (
              <div>
                <p className="text-sm font-medium text-gray-500">Company ID</p>
                <p className="mt-1 text-sm text-gray-900">{user.company_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Course Enrollments Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Course Enrollments
          </h2>

          {user.course_enrollments && user.course_enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Enrolled Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Completion Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.course_enrollments.map((enrollment) => (
                    <tr key={enrollment.course_id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.course_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusColors[enrollment.status]
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.completion_date
                          ? new Date(
                              enrollment.completion_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.grade !== null ? enrollment.grade : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              This user is not enrolled in any courses.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
