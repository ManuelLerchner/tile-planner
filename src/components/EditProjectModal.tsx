import React, { useCallback, useEffect, useId, useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../database/subabaseClient";

export default function EditProjectModal({
  projectId,
  setShowEdit,
  onEdit,
}: {
  projectId: string;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: () => void;
}) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const modalID = useId();
  const navigate = useNavigate();

  const fetchProject = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setProjectName(data.name);
    setProjectDescription(data.description);
  }, [projectId]);

  const deleteProject = async () => {
    await supabase.from("projects").delete().eq("id", projectId);
    navigate("/");
  };

  const submit = async () => {
    if (projectName === "") {
      alert("Please enter a project name");
      return;
    }

    const { error } = await supabase
      .from("projects")
      .update({ name: projectName, description: projectDescription })
      .eq("id", projectId);

    if (error) {
      alert(error.message);
      return;
    }

    setShowEdit(false);
    onEdit();
  };

    setTimeout(() => {
      try {
        const modal = document.getElementById(modalID) as HTMLInputElement;
        modal.checked = true;
      } catch (e) {
        console.error(e);
      }
    }, 20);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <>
      <input
        type="checkbox"
        id={modalID}
        className="modal-toggle"
        onClick={() => {
          setShowEdit(false);
        }}
      />
      <label
        htmlFor={modalID}
        className="modal cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-semibold">Edit project</h3>
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
              className="input p-2 h-36 bg-gray-400 placeholder:text-gray-500"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />

            <div className="flex justify-between gap-4 mt-4">
              <button className="btn btn-error" onClick={deleteProject}>
                Delete Project
              </button>

              <button className="btn btn-success" onClick={submit}>
                Save
              </button>
            </div>
          </div>
        </label>
      </label>
    </>
  );
}
