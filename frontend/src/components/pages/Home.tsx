import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <>
      <div>Home</div>
    </>
  );
}
