import {Outlet} from "react-router";
import NavBar from "../../components/navbar/Navbar";

const Layout = () => {
    return(
        <>
          <NavBar logo="Kommanda" slogan="El sitio con +50 bebidas!"/>
          <Outlet />
        </>
    )
  
}

export default Layout;