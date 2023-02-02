import { Fragment } from "react";
import Nav from "./nav";

const Container = ({ children, mainClass }) => {
  return (
    <Fragment>
      <div className="p-8 bg-red-50 text-slate-800 w-screen max-w-full">
        <Nav />
        <main className={mainClass + " mx-auto max-w-7xl"}>{children}</main>
      </div>
    </Fragment>
  );
};

export default Container;
