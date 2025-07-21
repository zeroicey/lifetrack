import { createBrowserRouter } from "react-router";
import IndexPage from "./pages";
import LoginPage from "./pages/login";
import GuidePage from "./pages/guide";

const router = createBrowserRouter([
    { path: "/", Component: IndexPage },
    { path: "login", Component: LoginPage },
    { path: "guide", Component: GuidePage },
]);

export default router;
