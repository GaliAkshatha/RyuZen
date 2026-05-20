import React from "react";
import TopBar from "../../shared/components/TopBar";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function UserLayout({ children }){
    const navigate = useNavigate();
      return (

    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] text-white">

      <TopBar />

      <main className="p-6">
        <Outlet />
      </main>

    </div>
    );
}

export default UserLayout;