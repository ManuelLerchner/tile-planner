import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProjectCard from "../../components/ProjectCard";
import { Project } from "../../types/Project";
import AddProjectCard from "../../components/AddProjectCard";
import { supabase } from "../../database/subabaseClient";
import { Box, CircularProgress } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [earliestDate, setEarliestDate] = useState<Date>(new Date());

  const fetchNewData = useCallback(async () => {
    setLoaded(false);
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at, image")
      .eq("user_id", user?.id)
      .filter("created_at", "lt", earliestDate?.toISOString())
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      alert(error.message);
      return;
    }

    const projectData = data as Project[];

    setData((prev) => [...prev, ...projectData]);

    setLoaded(true);
  }, [user?.id, earliestDate]);

  const reloadAllData = useCallback(async () => {
    setLoaded(false);

    const { data: newData, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at, image")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(data.length);

    if (error) {
      alert(error.message);
      return;
    }

    const projectData = newData as Project[];

    setData(projectData);
    setLoaded(true);
  }, [user?.id, data.length]);

  useEffect(() => {
    fetchNewData();
  }, [fetchNewData]);

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
              onEdit={reloadAllData}
            />
          ))}

        {loaded && data.length === 0 && (
          <div className="flex flex-row justify-center items-center w-full h-full">
            <h3 className="text-lg text-white font-semibold">
              You have no projects yet ...
            </h3>
          </div>
        )}

        {loaded && data.length > 0 && (
          <div
            className="flex flex-row justify-center items-center w-full h-full cursor-pointer mt-8"
            onClick={() => {
              setEarliestDate(new Date(data[data.length - 1].created_at));
            }}
          >
            <h3 className="text-lg text-white font-semibold flex flex-col items-center hover:scale-110">
              <CloudDownloadIcon />
              <span className="ml-4">Load more ...</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
