import {Outlet} from "react-router";
import NavBar from "../../components/navbar/Navbar";

const Layout = ({cantPlatos}) => {
    return(
        <>
          <NavBar logo="Kommanda" slogan={`El sitio con ${cantPlatos} platos!`}/>
          <Outlet />
        </>
    )
  
}

export default Layout;