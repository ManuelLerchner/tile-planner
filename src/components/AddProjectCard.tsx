import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { supabase } from "../database/subabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function AddProjectCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const submit = async () => {
    if (projectName === "") {
      alert("Please enter a project name");
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: projectName,
          description: projectDescription,
          user_id: user?.id,
        },
      ])
      .select("id")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    const { error: error2 } = await supabase.from("drawings").insert([
      {
        id: data.id,
      },
    ]);

    if (error2) {
      alert(error2.message);
      return;
    }

    navigate("/editor/" + data.id);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-stone-800 text-white rounded-lg p-6 w-96 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Create a new project</h3>

            <div className="flex flex-col gap-4 my-4">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                id="projectName"
                className="rounded px-3 py-2 bg-gray-400 placeholder:text-gray-600 text-black"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <label htmlFor="projectDescription">Project Description</label>
              <textarea
                id="projectDescription"
                className="rounded px-3 py-2 h-24 bg-gray-400 placeholder:text-gray-600 text-black"
                placeholder="Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />

              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                  onClick={submit}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-72 bg-slate-800 rounded-xl border border-slate-700 hover:border-teal-500/60 shadow-xl cursor-pointer hover:scale-[102%] transition-all duration-150 overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="h-44 flex items-center justify-center bg-slate-700/50">
          <AddIcon style={{ fontSize: 64, color: "#2dd4bf" }} />
        </div>
        <div className="px-4 py-3">
          <h2 className="text-white font-semibold">New Project</h2>
          <p className="text-slate-400 text-sm mt-0.5">Create a new project</p>
        </div>
      </div>
    </>
  );
}
