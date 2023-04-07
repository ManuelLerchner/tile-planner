export type Mode = {
  name: "Marker" | "Connect" | "Delete" | "Align" | "Hand";
  icon: string;
};

export const Modes: Mode[] = [
  {
    name: "Marker",
    icon: "pencil",
  },
  {
    name: "Connect",
    icon: "link",
  },
  {
    name: "Delete",
    icon: "trash",
  },
  {
    name: "Align",
    icon: "trash",
  },
  {
    name: "Hand",
    icon: "trash",
  },
];
