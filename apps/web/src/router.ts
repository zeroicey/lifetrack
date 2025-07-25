import { createBrowserRouter } from "react-router";
import MomentPage from "@/pages/module/moment";
import MomentCreatePage from "@/pages/module/moment/create";
import TaskPage from "@/pages/module/task";
import HabitPage from "@/pages/module/habit";
import IndexPage from "@/pages";
import LoginPage from "@/pages/login";
import GuidePage from "@/pages/guide";
import ModuleLayout from "./components/layouts/module-layout";
import RootLayout from "./components/layouts/root-layout";
import HomePage from "./pages/module/home";
const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: IndexPage },
            { path: "login", Component: LoginPage },
            { path: "guide", Component: GuidePage },
            {
                Component: ModuleLayout,
                children: [
                    {
                        path: "home",
                        children: [{ index: true, Component: HomePage }],
                    },
                    {
                        path: "moment",
                        children: [
                            { index: true, Component: MomentPage },
                            { path: "create", Component: MomentCreatePage },
                        ],
                    },
                    {
                        path: "task",
                        children: [{ index: true, Component: TaskPage }],
                    },
                    {
                        path: "habit",
                        children: [{ index: true, Component: HabitPage }],
                    },
                ],
            },
        ],
    },
]);

export default router;
