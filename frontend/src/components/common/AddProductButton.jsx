import { Link } from "react-router-dom";

const AddProductButton = () => {
  return (
    <Link to={`/productposting`} className="bg-linear-to-r from-blue-400 to-purple-600 text-white px-3 py-2
                       rounded-lg hover:scale-102 hover:shadow-lg active:scale-98 text-base font-semibold">
      + Thêm sản phẩm
    </Link>
  );
};

export default AddProductButton;
