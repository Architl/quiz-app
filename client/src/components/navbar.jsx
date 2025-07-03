// Import required React hooks and components
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Navbar,
  Nav as BootstrapNav,
  Offcanvas,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; // Custom auth context
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome for icons
import {
  faHouse,
  faPalette,
  faStar,
  faGlobe,
  faLandmark,
  faBasketball,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // For navigation

function Nav() {
  // Destructure auth context methods and state
  const {
    showLoginModal,
    setShowLoginModal,
    showSignupModal,
    setShowSignupModal,
    showAuthPrompt,
    setShowAuthPrompt,
    user,
    setUser,
    logout,
  } = useAuth();

  // Local state variables for forms and modals
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmailForOtp, setUserEmailForOtp] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // Fetch user profile from server using saved token
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      logout();
    }
  };

  // Call fetchUserProfile once when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle user registration
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsAuthSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert(data.message);
      setUserEmailForOtp(email);
      setShowSignupModal(false);
      setShowOtpModal(true); // Show OTP modal after successful signup
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setIsOtpSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-email`, {
        email: userEmailForOtp,
        otp,
      });
      alert(data.message);
      setShowOtpModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Verification failed");
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  // Resend OTP to user's email
  const handleResendOtp = async () => {
    setIsResetSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/resend-otp`, {
        email: userEmailForOtp,
      });
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      alert("Login successful");
      setShowLoginModal(false);
      fetchUserProfile(); // Refresh user info
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // Request OTP for forgot password flow
  const handleForgotPassword = async () => {
    setIsOtpSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, {
        email: resetEmail,
      });
      alert(data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  // Reset user password using OTP
  const handleResetPassword = async () => {
    setIsResetSubmitting(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, {
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });
      alert(data.message);
      setShowForgotModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Reset failed");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  return (
    <>
      {/* Navigation bar with brand and toggle button */}
      <Navbar expand="md" className="p-3">
        <Navbar.Brand>
          <img
            src="/quiz_logo.png"
            style={{ width: "150px" }}
            alt="Quiz Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />

        {/* Offcanvas menu for smaller screens */}
        <Navbar.Offcanvas id="offcanvasNavbar" placement="end">
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            {/* Show auth buttons inside offcanvas (small screens only) */}
            <div className="d-md-none mb-4">
              {user ? (
                // Logged-in user section
                <div className="d-flex flex-column align-items-center gap-2">
                  <span className="fw-bold text-dark">Hi, {user.name} 👋</span>
                  <Button
                    variant="danger"
                    className="rounded-pill px-4"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                // Guest user auth buttons
                <div className="d-flex flex-column align-items-center gap-2">
                  <Button
                    style={{ backgroundColor: "#c6ea84", borderRadius: "20px" }}
                    className="fw-bold pt-1 pb-1 ps-4 pe-4 me-2 shadow text-dark"
                    onClick={() => setShowSignupModal(true)}
                  >
                    Sign Up
                  </Button>
                  <Button
                    style={{
                      color: "black",
                      backgroundColor: "#c6ea84",
                      borderRadius: "20px",
                    }}
                    className="fw-bold pt-1 pb-1 ps-4 pe-4 me-2 shadow text-dark"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Category links inside offcanvas for small screens */}
            <div className="d-md-none">
              <BootstrapNav className="flex-column align-items-center gap-2">
                {/* Each category icon link */}
                <Link
                  to="/"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faHouse} size="2x" />
                  <span className="mt-1">Home</span>
                </Link>
                <Link
                  to="/category/Art & Literature"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faPalette} size="2x" />
                  <span className="mt-1">Art & Literature</span>
                </Link>
                <Link
                  to="/category/Entertainment"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faStar} size="2x" />
                  <span className="mt-1">Entertainment</span>
                </Link>
                <Link
                  to="/category/Geography"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faGlobe} size="2x" />
                  <span className="mt-1">Geography</span>
                </Link>
                <Link
                  to="/category/History"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faLandmark} size="2x" />
                  <span className="mt-1">History</span>
                </Link>
                <Link
                  to="/category/Sports"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faBasketball} size="2x" />
                  <span className="mt-1">Sports</span>
                </Link>
                <Link
                  to="/category/Science & Nature"
                  className="nav-link d-flex flex-column align-items-center text-dark"
                >
                  <FontAwesomeIcon icon={faLeaf} size="2x" />
                  <span className="mt-1">Science & Nature</span>
                </Link>
              </BootstrapNav>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* Show auth buttons on desktop view */}
        <div className="ms-auto d-none d-md-flex align-items-center gap-2">
          {user ? (
            <>
              <span className="fw-bold text-dark">Hi, {user.name} 👋</span>
              <Button
                variant="danger"
                className="rounded-pill px-4"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                style={{
                  color: "black",
                  backgroundColor: "#c6ea84",
                  borderRadius: "20px",
                }}
                className="fw-bold pt-1 pb-1 ps-4 pe-4 me-2 shadow"
                onClick={() => setShowSignupModal(true)}
              >
                Sign Up
              </Button>
              <Button
                style={{
                  color: "black",
                  backgroundColor: "#c6ea84",
                  borderRadius: "20px",
                }}
                className="fw-bold pt-1 pb-1 ps-4 pe-4 me-2 shadow"
                onClick={() => setShowLoginModal(true)}
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </Navbar>
      <hr className="m-0 mb-3" />

      {/* === MODALS === */}

      {/* Login Modal */}
      <Modal
        style={{ fontFamily: "cursive" }}
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="link"
              onClick={() => {
                setShowLoginModal(false);
                setShowForgotModal(true);
              }}
            >
              Forgot Password?
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleLogin}
            disabled={isAuthSubmitting}
          >
            {isAuthSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Signup Modal */}
      <Modal
        style={{ fontFamily: "cursive" }}
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSignupModal(false)}>
            Close
          </Button>
          <Button onClick={handleSignup} disabled={isAuthSubmitting}>
            {isAuthSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        style={{ fontFamily: "cursive" }}
        show={showOtpModal}
        onHide={() => setShowOtpModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleResendOtp}
            disabled={isResetSubmitting}
          >
            Resend OTP
          </Button>
          <Button
            variant="success"
            onClick={handleVerifyOtp}
            disabled={isOtpSubmitting}
          >
            Verify
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Forgot/Reset Password Modal */}
      <Modal
        style={{ fontFamily: "cursive" }}
        show={showForgotModal}
        onHide={() => setShowForgotModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="secondary"
            onClick={handleForgotPassword}
            disabled={isOtpSubmitting}
          >
            Send OTP
          </Button>
          <Form.Group>
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowForgotModal(false)}>Cancel</Button>
          <Button
            variant="success"
            onClick={handleResetPassword}
            disabled={isResetSubmitting}
          >
            Reset
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal that prompts user to login/signup when needed */}
      <Modal
        style={{ fontFamily: "cursive" }}
        show={showAuthPrompt}
        onHide={() => setShowAuthPrompt(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome to QuizApp</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Please sign in or create an account to continue</p>
          <Button
            className="me-1"
            variant="primary"
            onClick={() => {
              setShowAuthPrompt(false);
              setShowLoginModal(true);
            }}
          >
            Sign In
          </Button>
          <Button
            className="ms-1"
            variant="success"
            onClick={() => {
              setShowAuthPrompt(false);
              setShowSignupModal(true);
            }}
          >
            Sign Up
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Nav;
