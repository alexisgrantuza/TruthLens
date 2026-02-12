// frontend/src/components/layout/Layout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Camera, CheckCircle, Image, User, LogOut } from "lucide-react";

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                TruthLens
              </span>
            </Link>

            <nav className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/capture"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capture</span>
                  </Link>
                  <Link
                    to="/verify"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify</span>
                  </Link>
                  <Link
                    to="/gallery"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Image className="w-5 h-5" />
                    <span>Gallery</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 TruthLens. Verifying Reality in the Age of AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
