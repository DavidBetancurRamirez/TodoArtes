interface LoaderProps {
  isShown?: boolean;
  fullScreen?: boolean;
}

const Loader = ({ isShown = true, fullScreen = true }: LoaderProps) => {
  if (!isShown) {
    return null;
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
