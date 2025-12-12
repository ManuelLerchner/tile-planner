import { useCallback, useEffect, useState } from "react";
import { supabase } from "../database/subabaseClient";

export default function KeepAlive() {
  let [data, setData] = useState<any[]>([]);

  const fetchNewData = useCallback(async () => {
    const { data } = await supabase.from("keep-alive").select("*");
    if (data) {
      setData(data);
    }
  }, []);

  useEffect(() => {
    fetchNewData();
  }, [fetchNewData]);

  return (
    <>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </>
  );
}
