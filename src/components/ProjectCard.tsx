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
        className="card w-96 bg-gray-800 shadow-2xl cursor-pointer hover:scale-[102%]"
        onClick={() => navigate("/editor/" + project.id)}
      >
        <div className="relative">
          <figure>
            {(project.thumbnail && (
              <img
                className="rounded-t-md h-48 w-full object-fill border-b border-gray-700"
                src={project.thumbnail}
                alt={project.name + " image"}
              />
            )) || (
              <div className="rounded-t-md w-full h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl text-gray-400 drop-shadow-lg">
                  📁
                </span>
              </div>
            )}
            <div className="card-actions text-yellow-300 absolute bottom-2 right-2">
              <div className="badge badge-outline">
                {new Date(project.created_at).toLocaleDateString("gb-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) +
                  " - " +
                  new Date(project.created_at).toLocaleTimeString("gb-GB", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
              </div>
            </div>
          </figure>
        </div>
        <div className="card-body text-white pt-2">
          <div className="flex flex-row justify-between items-center">
            <h2 className="card-title">{project.name}</h2>
            <Edit
              className="m-4 text-green-500 hover:scale-110"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setShowEdit(true);
              }}
            />
          </div>
          <p className="text-gray-400 text-sm">{project.description}</p>
        </div>
      </div>
    </>
  );
}
