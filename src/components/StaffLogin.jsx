

const LoginButton = () => {
  const handleLogin = () => {
    // Redirect the user to the authorize.php script for Shibboleth login
    window.location.href = 'https://libtools2.smith.edu/gadgets-to-go/backend/admin/authorize.php';
  };

  return (
    <button onClick={handleLogin} className="btn btn-primary">
      Staff Login
    </button>
  );
};

export default LoginButton;
