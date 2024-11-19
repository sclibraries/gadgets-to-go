// import { useHistory } from 'react-router-dom'; // If you're using react-router-dom v5
// For react-router-dom v6, use useNavigate instead

function Header() {
//   const history = useHistory(); // For react-router-dom v5
  // const navigate = useNavigate(); // For react-router-dom v6

  const handleLogout = () => {
    // Remove the authentication token from localStorage
    const currentUrl = window.location.href;
    localStorage.setItem('lastPage', currentUrl);
  
    // Remove token from storage
    localStorage.removeItem('authToken');

    // Redirect to the backend logout URL to log out of Shibboleth
    window.location.href = 'https://libtools2.smith.edu/gadgets-to-go/backend/admin-logout/logout.php';

  };

  return (
    <nav className="navbar fixed-top bg-body-tertiary bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Gadgets-To-Go Admin</a>
        <form className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Log out
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Header;
