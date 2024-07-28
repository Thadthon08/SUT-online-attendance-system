import { FiHome, FiTrendingUp } from "react-icons/fi";
import { IconType } from "react-icons";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

export const LinkItems: Array<LinkItemProps> = [
  { name: "523201 Computer Programming II", icon: FiHome, href: "/home" },
  { name: "ห้องประชุม", icon: FiTrendingUp, href: "/dashboard/room" },
];
