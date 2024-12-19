export const DashboardStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <p>8 new candidates added to Tech Lead Search</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p>Culture fit survey completed for Frontend Developer</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">Project Stats</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Projects</span>
          <span className="font-medium">2</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Candidates</span>
          <span className="font-medium">350</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shortlisted</span>
          <span className="font-medium">20</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
          Create new search query
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
          Review shortlisted candidates
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
          Schedule interviews
        </button>
      </div>
    </div>
  </div>
);