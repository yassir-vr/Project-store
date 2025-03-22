import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Récupérer les informations de l'utilisateur

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirigez vers la page d'accueil si l'utilisateur n'est pas un admin
    }
  }, [user, navigate]);

  // Si l'utilisateur est un admin, affichez le contenu protégé
  return user && user.role === 'admin' ? children : null;
};

export default AdminRoute;