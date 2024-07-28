import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/Approutes";




function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
