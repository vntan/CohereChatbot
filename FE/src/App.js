import './App.css';
import MainPage  from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { auth } from "./utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {

  const [user, loading, error] = useAuthState(auth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage/>,
      loader: async () => {
        if (loading || !user) throw redirect("/login", { replace: true });
        return {}
      }
    },
    {
      path: "login",
      element: <LoginPage/>,
      loader: async () => {
        if (!loading && user) throw redirect("/", { replace: true });
        return {}
      }
    },
    {
      path: "forgetpassword",
      element: <ForgotPassword/>,
      loader: async () => {
        if (!loading && user) throw redirect("/", { replace: true });
        return {}
      }
    },
    {
      path: "register",
      element: <RegisterPage/>,
      loader: async () => {
        if (!loading && user) throw redirect("/", { replace: true });
        return {}
      }
    },
  ]);

  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
