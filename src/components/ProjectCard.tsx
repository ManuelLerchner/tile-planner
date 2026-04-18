import { Edit } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "../types/Project";
import EditProjectModal from "./EditProjectModal";

export default function ProjectCard({
  project,
  onEdit,
}: {
  project: Project;
  onEdit: () => void;
}) {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = React.useState(false);

  return (
    <>
      {showEdit && (
        <EditProjectModal
          projectId={project.id}
          setShowEdit={setShowEdit}
          onEdit={onEdit}
        />
      )}

      <div
        className="w-72 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500 shadow-xl cursor-pointer hover:scale-[102%] transition-all duration-150 overflow-hidden"
        onClick={() => navigate("/editor/" + project.id)}
      >
        <div className="relative">
          {project.thumbnail ? (
            <img
              className="w-full h-44 object-cover"
              src={project.thumbnail}
              alt={project.name}
            />
          ) : (
            <div className="w-full h-44 bg-slate-700 flex items-center justify-center">
              <span className="text-4xl text-slate-500">📁</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/50 text-slate-300 text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {new Date(project.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-white font-semibold truncate">{project.name}</h2>
            {project.description && (
              <p className="text-slate-400 text-sm truncate mt-0.5">
                {project.description}
              </p>
            )}
          </div>
          <button
            className="ml-3 p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition-colors flex-shrink-0"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(true);
            }}
          >
            <Edit fontSize="small" />
          </button>
        </div>
      </div>
    </>
  );
}
