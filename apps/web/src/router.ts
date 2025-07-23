import { createBrowserRouter } from "react-router";
import IndexPage from "@/pages";
import LoginPage from "@/pages/login";
import GuidePage from "@/pages/guide";
import MomentPage from "@/pages/module/moment";
import MomentCreatePage from "@/pages/module/moment/create";
import TaskPage from "@/pages/module/task";
import HabitPage from "@/pages/module/habit";

const router = createBrowserRouter([
    { path: "/", Component: IndexPage },
    { path: "login", Component: LoginPage },
    { path: "guide", Component: GuidePage },
    {
        children: [
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
]);

export default router;
