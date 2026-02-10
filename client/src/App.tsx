import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import BlogPosts from "./pages/admin/BlogPosts";
import CmsLogin from "./pages/cms/CmsLogin";
import BlogPost from "./pages/BlogPost";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path={"/cms/login"} component={CmsLogin} />
      <Route path={"/cms"} component={() => (
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      )} />
      <Route path={"/cms/users"} component={() => (
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      )} />
      <Route path={"/cms/blog-posts"} component={() => (
        <DashboardLayout>
          <BlogPosts />
        </DashboardLayout>
      )} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
