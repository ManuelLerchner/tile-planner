import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { supabase } from "../database/subabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function AddProjectCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <input type="checkbox" id="modal" className="modal-toggle" />
      <label htmlFor="modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Create a new project</h3>
          <div className="flex flex-col gap-4 my-4">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              className="input border bg-gray-400 placeholder:text-gray-500"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <label htmlFor="projectDescription">Project Description</label>
            <textarea
              id="projectDescription"
              className="input p-2 h-10 bg-gray-400 placeholder:text-gray-500"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <button
                className="btn btn-error"
                onClick={() => {
                  document.getElementById("modal")?.click();
                }}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={submit}>
                Create
              </button>
            </div>
          </div>
        </label>
      </label>

      <div
        className="card w-96 bg-gray-800 shadow-2xl cursor-pointer hover:scale-[102%]"
        onClick={() => {
          document.getElementById("modal")?.click();
        }}
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
