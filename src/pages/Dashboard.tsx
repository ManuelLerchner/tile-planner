import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProjectCard from "../components/ProjectCard";
import { Project } from "../types/Project";
import AddProjectCard from "../components/AddProjectCard";
import { supabase } from "../database/subabaseClient";
import { Box, CircularProgress } from "@mui/material";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    setLoaded(false);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at, image")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setData(data as Project[]);
    setLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-2xl text-white font-semibold">
        {user?.user_metadata.full_name + "'s Projects"}
      </h1>

      <div className="flex flex-row justify-between items-center my-8">
        <AddProjectCard />
      </div>

      <h2 className="text-2xl text-white font-semibold">Recent Projects</h2>
      <div className="flex flex-row flex-wrap gap-8 my-8">
        {(!loaded && (
          <div className="flex flex-row justify-center items-center w-full h-full">
            <Box sx={{ display: "flex" }}>
              <CircularProgress style={{ color: "white" }} />
            </Box>
          </div>
        )) ||
          data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={fetchData}
            />
          ))}
      </div>
    </div>
  );
}
