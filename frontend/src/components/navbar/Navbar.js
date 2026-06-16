import './Navbar.css';

const NavBar = ({logo, slogan}) => {
  return <nav className="nav">
    <div className="logo">{logo}</div>
    <div className="">{slogan}</div>
  </nav>
}

export default NavBar;
