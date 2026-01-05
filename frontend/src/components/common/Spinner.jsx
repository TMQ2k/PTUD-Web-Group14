const Spinner = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
    </div>
  );
};

export default Spinner;
