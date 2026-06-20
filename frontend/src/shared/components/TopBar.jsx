import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TopBar() {

  const navigate = useNavigate();
  const { user } = useAuth();

  return (

    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">

      <div className="flex items-center justify-between px-8 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-12">

          {/* LOGO */}
          <div
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            RyuZen
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            { user?.role === "admin" && (
                <>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="hover:text-white transition"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/admin/activities")}
                        className="hover:text-white transition"
                    >
                        Activities
                    </button>

                    <button className="hover:text-white transition">
                        Events
                    </button>

                    <button className="hover:text-white transition">
                        Data
                    </button>

                    <button className="hover:text-white transition">
                        Chat
                    </button>

                    <button className="hover:text-white transition">
                        AI
                    </button>
                </>
            )}
            
            { user?.role === "user" && (
                <>
                    <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="hover:text-white transition"
                    >
                        Dashboard
                    </button>

                    <button
                    className="hover:text-white transition"
                    >
                        Activities
                    </button>

                    <button className="hover:text-white transition">
                        Game
                    </button>

                    <button className="hover:text-white transition">
                        Academic
                    </button>

                    <button className="hover:text-white transition">
                        Chat
                    </button>

                    <button className="hover:text-white transition">
                        AI
                    </button>
                </>
            )}

          </nav>

        </div>


        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            className="
              bg-white/5
              border border-white/10
              rounded-xl
              px-4 py-2
              text-sm
              outline-none
              focus:border-cyan-400
              transition
            "
          />

          {/* PROFILE */}
          <button
            onClick={() => navigate("/admin/profile")}
            className="
              flex items-center gap-3
              bg-white/5
              hover:bg-white/10
              border border-white/10
              rounded-xl
              px-3 py-2
              transition
            "
          >

            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">
                {user?.name}
              </p>

              <p className="text-xs text-white/50">
                {user?.role}
              </p>
            </div>

          </button>

        </div>

      </div>

    </header>
  );
}

export default TopBar;