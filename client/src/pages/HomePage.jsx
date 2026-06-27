import { useAuthStore } from "../store/useAuthStore.js";


const HomePage = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col mx-auto items-center justify-center h-screen text-3xl font-bold">
      <h1>HomePage</h1>
      <button
        type="button"
        onClick={logout}
        className="text-red-600 px-4 py-2 border border-red-600 rounded-lg"
      >
        Logout
      </button>
    </div>
  )
}

export default HomePage;