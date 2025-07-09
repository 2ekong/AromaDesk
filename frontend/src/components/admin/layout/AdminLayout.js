import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

const AdminLayout = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <AdminHeader />
    <div style={{ display: "flex", flex: 1 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, background: "#fff" }}>
        {children}
      </main>
    </div>
    <AdminFooter />
  </div>
);

export default AdminLayout; 