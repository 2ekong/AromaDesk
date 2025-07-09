import React from "react";

const AdminFooter = () => (
  <footer style={{ width: "100%", background: "#f8fafc", borderTop: "1px solid #e5e7eb", padding: "20px 0", textAlign: "center", color: "#888", fontSize: 15, marginTop: 32 }}>
    AromaDesk Admin &copy; {new Date().getFullYear()}<br />
    All rights reserved.
  </footer>
);

export default AdminFooter; 