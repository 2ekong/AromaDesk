import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AdminMainPage = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/admin/dashboard"); }, [navigate]);
  return null;
};
export default AdminMainPage;
