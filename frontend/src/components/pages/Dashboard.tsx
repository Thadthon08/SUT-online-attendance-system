import { useAuth } from "../../contexts/AuthContext";
import MenuComponent from "../layout/Menu";

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <div>
      <div className="md:container md:mx-auto"></div>
    </div>
  );
}
