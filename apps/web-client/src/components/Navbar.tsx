import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-black tracking-tight hover:text-green-500 transition-colors"
            >
              Modelica AI Studio
            </button>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border-2 border-black">
                  <div className="w-8 h-8 bg-green-500 border-2 border-black flex items-center justify-center font-bold text-sm text-black">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-black">
                    {user.username}
                  </span>
                </div>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="px-6 py-3 text-sm font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
