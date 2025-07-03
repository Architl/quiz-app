import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPalette,
  faStar,
  faGlobe,
  faLandmark,
  faBasketball,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Category component displays navigation icons for quiz categories
function Category() {
  // Define each category with its corresponding icon, label, and route
  const categories = [
    { icon: faHouse, text: "Home", path: "/" },
    {
      icon: faPalette,
      text: "Art & Literature",
      path: "/category/Art & Literature",
    },
    { icon: faStar, text: "Entertainment", path: "/category/Entertainment" },
    { icon: faGlobe, text: "Geography", path: "/category/Geography" },
    { icon: faLandmark, text: "History", path: "/category/History" },
    { icon: faBasketball, text: "Sports", path: "/category/Sports" },
    {
      icon: faLeaf,
      text: "Science & Nature",
      path: "/category/Science & Nature",
    },
  ];

  return (
    // Container for category icons - only shown on medium+ screens
    <div className="d-none d-md-flex flex-row justify-content-around align-items-center p-3 w-100">
      {categories.map((category, index) => (
        // Each category is rendered as a link with icon and label
        <Link
          key={index}
          to={category.path}
          className="text-dark text-decoration-none"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <FontAwesomeIcon icon={category.icon} size="2x" />
          <span style={{ marginTop: "4px" }}>{category.text}</span>
        </Link>
      ))}
    </div>
  );
}

export default Category;
