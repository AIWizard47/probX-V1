
// Example Dashboard component - you can replace this with your actual dashboard
const Dashboard = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;

  // You might want to verify the token validity here

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Logout
      </button>
    </div>
  );
};
export default Dashboard

