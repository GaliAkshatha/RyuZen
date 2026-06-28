import { useState } from "react";
import { Eye, EyeOff, Trophy, Star, Zap, ConstructionIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

function AuthPage() {

  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role:"",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

    async function handleSubmit(e) {
    
    e.preventDefault();
    
    console.log("FORM SUBMITTED");
    try{

        const endpoint = isLogin 
        ? `${API}/auth/login`
        : `${API}/auth/admin-register`;

        if (isLogin && !formData.role){
            alert("Please select login type");

            return;
        }
        const response = await fetch(endpoint, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log(data);

        if(!response.ok){
          alert(data.message);
          return;
        }
        
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
          "token",
          data.token
        );

        setUser(data.user);

        if (data.user.role === "admin") {
            navigate("/admin/dashboard");
        }else{
            navigate("/user/dashboard");
        }
    }catch(error){
        console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center z-10">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-2xl">
              <Trophy size={32} />
            </div>

            <h1 className="text-4xl font-bold">
              RyuZen
            </h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Gamify Your
            <span className="text-cyan-400"> Campus Life</span>
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-lg">
            Earn points, complete activities, climb leaderboards,
            and unlock rewards across your campus ecosystem.
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <Star className="text-yellow-400" />
              <div>
                <h3 className="font-semibold">Leaderboard System</h3>
                <p className="text-sm text-gray-400">
                  Compete with students across clubs and events.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <Zap className="text-cyan-400" />
              <div>
                <h3 className="font-semibold">Real-time Rewards</h3>
                <p className="text-sm text-gray-400">
                  Gain XP and redeem campus benefits instantly.
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-xl p-1 flex w-full max-w-sm">

              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
                  isLogin
                    ? "bg-cyan-500 text-black font-semibold"
                    : "text-gray-400"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
                  !isLogin
                    ? "bg-purple-500 text-white font-semibold"
                    : "text-gray-400"
                }`}
              >
                Register
              </button>

            </div>
          </div>
           

          <form onSubmit={handleSubmit} className="space-y-6">

            {!isLogin && (
              <div>

                <label className="block mb-2 text-sm text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}


            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>


            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {isLogin && (
                <>      
                    <label className="block mb-3 text-sm text-gray-300">
                        Login As
                    </label>
                            
                        <div className="grid grid-cols-2 gap-4">

                                  {/* USER */}
                                  <button
                                      type="button"
                                      onClick={() => setFormData({
                                          ...formData,
                                          role: "user",
                                      })}
                                      className={`
                                        py-3 rounded-xl border transition-all duration-300

                                            ${formData.role === "user"
                                              ? "bg-cyan-500 text-black border-cyan-400"
                                              : "bg-white/5 border-white/10 text-white/70"}
                                      `}
                                    >
                                      Student/User
                                  </button>


                                  {/* ADMIN */}
                                  <button
                                      type="button"
                                      onClick={() => setFormData({
                                          ...formData,
                                          role: "admin",
                                      })}
                                      className={`
                                        py-3 rounded-xl border transition-all duration-300

                                        ${formData.role === "admin"
                                              ? "bg-purple-500 text-white border-purple-400"
                                              : "bg-white/5 border-white/10 text-white/70"}
                                      `}
                                    >
                                      Admin
                                  </button>    
                        </div>
                    </>
                )}
                
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                  : "bg-purple-500 hover:bg-purple-400"
              }`}
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

          </form>


          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin
              ? "New to CampusQuest?"
              : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-cyan-400 hover:underline"
            >
              {isLogin ? "Create account" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;

