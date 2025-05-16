import { useState } from 'react';
import { LogOut, Home, Settings, User, Bell, HelpCircle  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Faq from './Faq';
import EventManager from './Event';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear authentication
    localStorage.removeItem('token');

    alert('Logged out successfully');
    navigate('/')

  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">MyDashboard</h2>
        </div>
        <nav className="mt-6">
          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'home' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} className="mr-3" />
            <span>Home</span>
          </div>

          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'faq' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('faq')}
          >
            <Home size={20} className="mr-3" />
            <span>Faq</span>
          </div>


             <div
            className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'event' ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('event')}
          >
            <Home size={20} className="mr-3" />
            <span>Event</span>
          </div>


        </nav>
        <div className="mt-auto p-4 border-t">
          <button
            className="flex items-center text-red-600 hover:text-red-800"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'home' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">2,547</p>
                  <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Revenue</h3>
                  <p className="text-3xl font-bold text-blue-600">$34,245</p>
                  <p className="text-sm text-green-600 mt-2">+8% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Active Projects</h3>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-red-600 mt-2">-2 from last month</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-4">
                        {item}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Activity item {item}</p>
                        <p className="text-sm text-gray-500">Updated {item} hour{item !== 1 ? 's' : ''} ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq'  && (
            <Faq/>
          )}

          {activeTab === 'event'  && (
            <EventManager/>
          )}


        </main>
      </div>
    </div>
  );
}