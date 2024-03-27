import { ReactNode } from "react";

// PageHeader only appears in /admin page, so we create a _component here is enough
function PageHeader({ children }: Readonly<{ children: ReactNode }>) {
  return <h1 className="mb-4 font-bold text-2xl">{children}</h1>;
}

export default PageHeader;
