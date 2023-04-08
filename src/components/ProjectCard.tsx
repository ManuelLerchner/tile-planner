import React from "react";
import { Project } from "../types/Project";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  return (
    <div
      className="card w-96 bg-gray-800 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[102%]"
      onClick={() => navigate("/editor/" + project.id)}
    >
      <figure>
        {(project.image && (
          <img
            className="rounded-t-md h-48 w-full object-fill border-b border-gray-700"
            src={project.image}
            alt={project.name + " image"}
          />
        )) || (
          <div className="rounded-t-md w-full h-48 bg-gray-700 flex items-center justify-center">
            <span className="text-4xl text-gray-400 drop-shadow-lg">📁</span>
          </div>
        )}
      </figure>
      <div className="card-body text-white">
        <h2 className="card-title">{project.name}</h2>
        <p>{project.description}</p>
        <div className="card-actions justify-end text-yellow-300">
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
      </div>
    </div>
  );
}
