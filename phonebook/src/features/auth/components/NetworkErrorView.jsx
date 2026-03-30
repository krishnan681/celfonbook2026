const NetworkErrorView = ({ onRetry }) => {
  return (
    <div className="network-error">
      <img src="/logo.png" alt="logo" width={100} />
      <h4>Check your network connection</h4>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default NetworkErrorView;