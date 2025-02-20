import { ClipLoader, BeatLoader, BounceLoader , RingLoader } from "react-spinners";
import PropTypes from "prop-types";

const Loader = ({
  type = "ring",
  size = 70,
  color = "#fe424d",
  className = "",
}) => {
  const loaderTypes = {
    clip: ClipLoader,
    beat: BeatLoader,
    bounce: BounceLoader,
    ring:RingLoader
  };

  const SelectedLoader = loaderTypes[type] || ClipLoader;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)", // Light blur effect
        backdropFilter: "blur(8px)", // Ensures background blur
        zIndex: 9999, // Keeps it on top
      }}
    >
      <SelectedLoader size={size} color={color} className={className} />
    </div>
  );
};

Loader.propTypes = {
  type: PropTypes.oneOf(["clip", "beat", "bounce"]),
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string, // Allowing custom class names
};

export default Loader;
