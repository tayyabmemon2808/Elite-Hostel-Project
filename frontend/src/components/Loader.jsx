function Loader({ text }) {
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="spinner"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Loader;