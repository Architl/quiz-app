import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

// Component that renders Sign In and Sign Up modals based on AuthContext state
function AuthModals() {
  // Destructure values and functions from AuthContext
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
    setShowAuthPrompt,
    user,
    setUser,
    logout,
  } = useAuth();

  // Local state for form inputs
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  // Handle user login
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Login failed");

      // Save token and update user state on successful login
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setShowLoginModal(false); // Close modal
    } catch (err) {
      alert("Login error");
    }
  };

  // Handle user registration
  const handleSignup = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Signup failed");

      alert("Signup successful! Please verify your email.");
      setShowSignupModal(false); // Close modal
    } catch (err) {
      alert("Signup error");
    }
  };

  return (
    <>
      {/* Sign In Modal */}
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Email Input */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Password Input */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Close and Login buttons */}
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Name Input */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          {/* Email Input */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Password Input */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Close and Sign Up buttons */}
          <Button variant="secondary" onClick={() => setShowSignupModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSignup}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AuthModals;
