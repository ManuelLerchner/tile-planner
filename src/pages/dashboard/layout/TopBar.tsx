import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="bg-slate-800 flex flex-row justify-between items-center px-6 h-14 border-b border-slate-700 shadow-md flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-2 h-2 bg-teal-400 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400/40 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400/40 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400 rounded-[2px]" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          TilePlanner
        </span>
      </div>

      <div className="relative" ref={ref}>
        <button
          className="flex items-center gap-2.5 rounded-full hover:bg-slate-700 py-1 px-2 transition-colors cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-slate-300 text-sm hidden sm:block">
            {user.user_metadata.full_name}
          </span>
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="w-8 h-8 rounded-full ring-2 ring-slate-600"
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-white text-sm font-medium truncate">
                {user.user_metadata.full_name}
              </p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
