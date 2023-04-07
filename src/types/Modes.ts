import PushPinIcon from "@mui/icons-material/PushPin";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import PanToolIcon from "@mui/icons-material/PanTool";

export type Mode = {
  name: "Marker" | "Connect" | "Delete" | "Align" | "Hand";
  icon: React.ElementType;
};

export const Modes: Mode[] = [
  {
    name: "Hand",
    icon: PanToolIcon,
  },
  {
    name: "Marker",
    icon: PushPinIcon,
  },
  {
    name: "Connect",
    icon: TimelineIcon,
  },
  {
    name: "Delete",
    icon: DeleteIcon,
  },
  {
    name: "Align",
    icon: OpenWithIcon,
  },
];
