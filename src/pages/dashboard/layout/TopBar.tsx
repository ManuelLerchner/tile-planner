import React from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function TopBar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="navbar bg-stone-800 flex flex-row justify-between items-center shadow-lg">
      <span className="btn btn-ghost normal-case text-2xl text-white">
        TilePlanner
      </span>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={user.user_metadata.avatar_url} alt="avatar" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <span className="justify-between">
              {user.user_metadata.full_name}
            </span>
          </li>
          <li>
            <span onClick={logout}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
