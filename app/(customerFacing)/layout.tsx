import React, { ReactNode } from "react";
import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

function CustomerLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href={"/"}>Home</NavLink>
        <NavLink href={"/products"}>Products</NavLink>
        <NavLink href={"/orders"}>Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}

export default CustomerLayout;
