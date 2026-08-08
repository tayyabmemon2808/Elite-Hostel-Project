import "./Error.css";

function Error({ message, type }) {
  if (!message) return null;

  return (
    <div className={`error error-${type}`}>
      {message}
    </div>
  );
}

export default Error;