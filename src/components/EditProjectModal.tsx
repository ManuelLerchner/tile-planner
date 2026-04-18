import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/subabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function EditProjectModal({
  projectId,
  setShowEdit,
  onEdit,
}: {
  projectId: string;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  if (!user) throw new Error("User not logged in");

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

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const deleteProject = async () => {
    await supabase.from("projects").delete().eq("id", projectId);
    await supabase.storage
      .from("thumbnails")
      .remove([user.id + "/" + projectId + ".jpg"]);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setShowEdit(false)}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-slate-800 text-white rounded-xl p-6 w-96 shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Edit project</h3>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-300" htmlFor="editName">
            Project Name
          </label>
          <input
            id="editName"
            type="text"
            className="rounded-lg px-3 py-2 bg-slate-700 border border-slate-600 placeholder:text-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <label className="text-sm text-slate-300" htmlFor="editDesc">
            Project Description
          </label>
          <textarea
            id="editDesc"
            className="rounded-lg px-3 py-2 h-28 bg-slate-700 border border-slate-600 placeholder:text-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            placeholder="Project Description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          <div className="flex justify-between gap-3 mt-2">
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors cursor-pointer"
              onClick={deleteProject}
            >
              Delete Project
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-sm font-medium transition-colors cursor-pointer"
              onClick={submit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
