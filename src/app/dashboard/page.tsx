import React from 'react'

export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">Active Tasks</h3>
                    <p className="text-3xl font-bold text-primary-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">Completed This Week</h3>
                    <p className="text-3xl font-bold text-green-600">8</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">Hours Tracked</h3>
                    <p className="text-3xl font-bold text-blue-600">24.5</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <p className="text-gray-600">Loading activities...</p>
                </div>
            </div>
        </div>
    )
} 