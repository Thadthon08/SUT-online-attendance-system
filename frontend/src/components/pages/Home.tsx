import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <>
      <div>Home</div>
      <button onClick={signOut} className="mt-4 bg-black text-white p-4">
        Sign Out
      </button>
    </>
  );
}
