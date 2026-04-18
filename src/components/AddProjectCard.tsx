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
        className="card w-96 bg-gray-800 shadow-2xl cursor-pointer hover:scale-[102%]"
        onClick={() => setIsOpen(true)}
      >
        <figure className="h-32">
          <AddIcon
            style={{
              fontSize: 100,
              color: "white",
            }}
          />
        </figure>
        <div className="card-body text-white pt-2">
          <h2 className="card-title">New Project</h2>
          <p>Create a new project</p>
        </div>
      </div>
    </>
  );
}
