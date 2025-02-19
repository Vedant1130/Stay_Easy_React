import { ClipLoader, BeatLoader, BounceLoader } from "react-spinners";
import PropTypes from "prop-types";

const Loader = ({ type = "clip", size = 50, color = "#36D7B7" }) => {
  const loaderTypes = {
    clip: ClipLoader,
    beat: BeatLoader,
    bounce: BounceLoader,
  };

  const SelectedLoader = loaderTypes[type] || ClipLoader;

  return (
    <div className="flex justify-center items-center h-screen">
      <SelectedLoader size={size} color={color} />
    </div>
  );
};

Loader.propTypes = {
  type: PropTypes.oneOf(["clip", "beat", "bounce"]),
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;
