import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Membresia from "./pages/Membresia";
import ClubInversion from "./pages/ClubInversion";
import BlogList from "./pages/BlogList";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/admin/Dashboard";
import VisaE2 from "./pages/VisaE2";
import Users from "./pages/admin/Users";
import BlogPosts from "./pages/admin/BlogPosts";
import CmsLogin from "./pages/cms/CmsLogin";
import BlogPost from "./pages/BlogPost";
import BienesRaices from "./pages/BienesRaices";
import Formacion from "./pages/Formacion";
import EstructuraInversion from "./pages/EstructuraInversion";
import ExpansionInternacional from "./pages/ExpansionInternacional";
import QuienesSomos from "./pages/QuienesSomos";
import Podcast from "./pages/Podcast";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import RutaInmobiliaria from "./pages/RutaInmobiliaria";
import LLC from "./pages/LLC";
import Perfil from "./pages/Perfil";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimers from "./pages/Disclaimers";
import Oportunidades from "./pages/Oportunidades";
import Eventos from "./pages/Eventos";
import InvestmentWeek from "./pages/InvestmentWeek";
import Recursos from "./pages/Recursos";
import EstructuraEmpresarial from "./pages/EstructuraEmpresarial";
import DiagnosticoPage from "./pages/DiagnosticoPage";
import Home2Page from "./pages/Home2Page";
import CumbreDigital from "./pages/CumbreDigital";
import CumbreDigital2 from "./pages/CumbreDigital2";
import Leads from "./pages/admin/Leads";
import NuevoHome from "./pages/NuevoHome";
import Membresia2 from "./pages/Membresia2";
import Section8 from "./pages/Section8";
import Propiedades from "./pages/Propiedades";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/home2"} component={Home2Page} />
      <Route path={"/tu-ruta"} component={NuevoHome} />
      <Route path="/membresia" component={Membresia} />
      <Route path="/membresia-2" component={Membresia2} />
      <Route path="/club-de-inversion-en-estados-unidos" component={ClubInversion} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/bienes-raices-en-usa" component={BienesRaices} />
      <Route path="/formacion" component={Formacion} />
      <Route path="/estructura-de-inversion-en-usa" component={EstructuraInversion} />
      <Route path="/visa-e2-inversionista-usa" component={VisaE2} />
      <Route path="/expansion-internacional-empresas" component={ExpansionInternacional} />
      <Route path="/quienes-somos" component={QuienesSomos} />
      <Route path="/podcast" component={Podcast} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsArticle} />
      <Route path="/ruta-inmobiliaria-en-estados-unidos" component={RutaInmobiliaria} />
      <Route path="/oportunidades-de-inversion-en-estados-unidos" component={Oportunidades} />
      <Route path="/eventos" component={Eventos} />
      <Route path="/investment-week" component={InvestmentWeek} />
      <Route path="/recursos" component={Recursos} />
      <Route path="/estructura-empresarial-en-estados-unidos" component={EstructuraEmpresarial} />
      <Route path="/visa-e2-inversion-en-estados-unidos" component={VisaE2} />
      <Route path="/llc" component={LLC} />
      <Route path="/perfil" component={Perfil} />
      <Route path="/terminos" component={TermsAndConditions} />
      <Route path="/privacidad" component={PrivacyPolicy} />
      <Route path="/disclaimers" component={Disclaimers} />
      <Route path="/diagnostico" component={DiagnosticoPage} />
      <Route path="/cumbre-digital" component={CumbreDigital} />
      <Route path="/cumbre-digital-2" component={CumbreDigital2} />
      <Route path="/vc-8" component={Section8} />
      <Route path="/propiedades" component={Propiedades} />
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
      <Route path={"/cms/leads"} component={() => (
        <DashboardLayout>
          <Leads />
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
