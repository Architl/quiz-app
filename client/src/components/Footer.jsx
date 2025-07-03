import React from "react";

// Footer component displayed at the bottom of the page
function Footer() {
  return (
    // Footer with centered text, light background, muted color, and spacing
    <footer className="text-center py-3 bg-light text-muted mt-auto">
      {/* Display current year dynamically with copyright message */}
      &copy; {new Date().getFullYear()} QuizApp. All rights reserved.
    </footer>
  );
}

export default Footer;
