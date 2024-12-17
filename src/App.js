import React, { useState } from "react";

function App() {
  const initialState = {
    employee_id: "",
    name: "",
    email: "",
    phone_number: "",
    department: "", // Initialize with an empty string
    date_of_joining: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "employee_id":
      case "name":
      case "department":
      case "role":
        if (!value.trim()) error = `${name.replace("_", " ")} is required.`;
        break;

      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) error = "Enter a valid email.";
        break;

      case "phone_number":
        if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit phone number.";
        break;

      case "date_of_joining":
        if (!value) {
          error = "Date of joining is required.";
        } else if (new Date(value) > new Date()) {
          error = "Date of joining cannot be in the future.";
        }
        break;

      default:
        break;
    }
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Field validation
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Employee added successfully!");
        setFormData(initialState);
        setErrors({});
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check the server connection.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "30px",
          backgroundColor: "white",
          width: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Employee Details</h2>
        <form onSubmit={handleSubmit}>
          {[ 
            { name: "employee_id", label: "Employee ID" },
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "phone_number", label: "Phone Number" },
            { name: "department", label: "Department" }, // Department field
            { name: "date_of_joining", label: "Date of Joining", type: "date" },
            { name: "role", label: "Role" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name} style={{ marginBottom: "15px" }}>
              <label style={{ marginBottom: "5px", display: "block" }}>{label}</label>
              {name === "department" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  <option value="">Select Department</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              )}
              {errors[name] && (
                <span style={{ color: "red", fontSize: "12px" }}>{errors[name]}</span>
              )}
            </div>
          ))}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={Object.values(errors).some((error) => error)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
