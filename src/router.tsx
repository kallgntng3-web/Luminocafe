import Index from "./pages/Index";
import Menu from "./pages/Menu";
import AllYouCanDrink from "./pages/AllYouCanDrink";
import Gallery from "./pages/Gallery";
import Promo from "./pages/Promo";
import Location from "./pages/Location";
import BookTable from "./pages/BookTable";
import DownloadPage from "./pages/Download";
import AdminLogin from "./pages/admin/Login";
import AdminSignup from "./pages/admin/Signup";
import AdminDashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import ReviewsManagement from "./pages/admin/ReviewsManagement";
import PromosManagement from "./pages/admin/PromosManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import HeroSectionManagement from "./pages/admin/HeroSectionManagement";
import AYCDManagement from "./pages/admin/AYCDManagement";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Index />,
    },
    {
      path: "/menu",
      name: 'menu',
      element: <Menu />,
    },
    {
      path: "/all-you-can-drink",
      name: 'all-you-can-drink',
      element: <AllYouCanDrink />,
    },
    {
      path: "/gallery",
      name: 'gallery',
      element: <Gallery />,
    },
    {
      path: "/promo",
      name: 'promo',
      element: <Promo />,
    },
    {
      path: "/location",
      name: 'location',
      element: <Location />,
    },
    {
      path: "/book",
      name: 'book',
      element: <BookTable />,
    },
    {
      path: "/download",
      name: 'download',
      element: <DownloadPage />,
    },
    {
     path: "/admin",
     name: 'admin-login',
     element: <AdminLogin />,
    },
    {
    path: "/admin/dashboard",
    name: 'admin-dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
    },
    {
      path: "/admin/signup",
      name: 'admin-signup',
      element: <AdminSignup />,
    },
    {
      path: "/admin/menu",
      name: 'admin-menu',
      element: <ProtectedRoute><MenuManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/gallery",
      name: 'admin-gallery',
      element: <ProtectedRoute><GalleryManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/reviews",
      name: 'admin-reviews',
      element: <ProtectedRoute><ReviewsManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/promos",
      name: 'admin-promos',
      element: <ProtectedRoute><PromosManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/bookings",
      name: 'admin-bookings',
      element: <ProtectedRoute><BookingsManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/messages",
      name: 'admin-messages',
      element: <ProtectedRoute><MessagesManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/categories",
      name: 'admin-categories',
      element: <ProtectedRoute><CategoriesManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/settings",
      name: 'admin-settings',
      element: <ProtectedRoute><SettingsManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/hero",
      name: 'admin-hero',
      element: <ProtectedRoute><HeroSectionManagement /></ProtectedRoute>,
    },
    {
      path: "/admin/aycd",
      name: 'admin-aycd',
      element: <ProtectedRoute><AYCDManagement /></ProtectedRoute>,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
