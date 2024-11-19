import { useState } from 'react';
import { toast } from 'react-toastify';

function RequestAccess() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Libraries');
  const [school, setSchool] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const baseUrl = 'https://libtools2.smith.edu/gadgets-to-go/backend/web';

  const allowedDomains = [
    'smith.edu',
    'umass.edu',
    'hampshire.edu',
    'mtholyoke.edu',
    'amherst.edu',
  ];

  // Helper function to validate email domain
  const validateEmail = (email) => {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Check if email is valid and from an allowed domain
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email must be from smith.edu, umass.edu, hampshire.edu, mtholyoke.edu, or amherst.edu';
    }

    // Check if full name is provided
    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    }

    // Check if school is selected
    if (!school) {
      newErrors.school = 'You must select a college';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!validateForm()) {
      return;
    }
  
    // Prepare data to send
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('department', department);
    formData.append('role', 'staff');
    formData.append('school', school);
  
    try {
      const response = await fetch(`${baseUrl}/api/request-access/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setSubmitted(true);
        toast.success('Request submitted successfully');
      } else {
        // Handle backend validation errors
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Request Access</h2>
      {submitted ? (
        <div className="alert alert-success">
          <p>Thank you for your request. It will be reviewed and an email will be sent once your account is activated.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name:
            </label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="department" className="form-label">
              Department:
            </label>
            <select
              className="form-select"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select a department</option>  
              <option value="Libraries">Libraries</option>
              <option value="IT">IT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="school" className="form-label">
              College:
            </label>
            <select
              className={`form-select ${errors.school ? 'is-invalid' : ''}`}
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            >
              <option value="">Select a college</option>
              <option value="amherst">Amherst College</option>
              <option value="hampshire">Hampshire College</option>
              <option value="mtholyoke">Mount Holyoke College</option>
              <option value="smith">Smith College</option>
              <option value="umass">University of Massachusetts</option>
            </select>
            {errors.school && <div className="invalid-feedback">{errors.school}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default RequestAccess;
