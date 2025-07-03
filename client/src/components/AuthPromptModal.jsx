import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

// Modal shown when a user tries to access a feature without being logged in
const AuthPromptModal = () => {
  // Get state and functions from AuthContext
  const {
    showAuthPrompt, // controls visibility of this modal
    setShowAuthPrompt, // function to close this modal
    setShowLoginModal, // function to show Sign In modal
    setShowSignupModal, // function to show Sign Up modal
  } = useAuth();

  return (
    <Modal
      show={showAuthPrompt}
      onHide={() => setShowAuthPrompt(false)}
      centered
    >
      {/* Modal header with close button */}
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Login Required</Modal.Title>
      </Modal.Header>

      {/* Modal body with prompt and auth action buttons */}
      <Modal.Body className="text-center">
        <p>You need to sign in to access this feature.</p>

        {/* Button to open Sign Up modal */}
        <Button
          variant="success"
          className="me-2"
          onClick={() => {
            setShowAuthPrompt(false); // close current modal
            setShowSignupModal(true); // open sign up modal
          }}
        >
          Sign Up
        </Button>

        {/* Button to open Sign In modal */}
        <Button
          variant="primary"
          onClick={() => {
            setShowAuthPrompt(false); // close current modal
            setShowLoginModal(true); // open login modal
          }}
        >
          Sign In
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AuthPromptModal;
