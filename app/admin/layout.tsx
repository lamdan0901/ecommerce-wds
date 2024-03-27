import React, { ReactNode } from "react";
import { Nav, NavLink } from "@/components/Nav";

// force no caching for admin page
export const dynamic = "force-dynamic";

function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href={"/admin"}>Dashboard</NavLink>
        <NavLink href={"/admin/products"}>Products</NavLink>
        <NavLink href={"/admin/users"}>Customers</NavLink>
        <NavLink href={"/admin/orders"}>Products</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}

export default AdminLayout;
