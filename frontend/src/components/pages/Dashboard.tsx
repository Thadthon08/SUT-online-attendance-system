import { useAuth } from "../../contexts/AuthContext";
import MenuComponent from "../layout/Menu";

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <div>
      <MenuComponent />
      <div className="md:container md:mx-auto">
        <button onClick={signOut} className="mt-4 bg-black text-white p-4">
          Sign Out
        </button>
      </div>
    </div>
  );
}
