import PropTypes from "prop-types";

Toast.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default function Toast(props) {
  const { isVisible, message } = props;
  return (
    isVisible && (
      <div className="popup-modal absolute inset-0 bg-gray-600 bg-opacity-50 w-full h-full flex flex-wrap justify-center items-center">
        <div className=" bg-white p-4 rounded shadow-lg w-96 text-center">
          {message}
        </div>
      </div>
    )
  );
}
