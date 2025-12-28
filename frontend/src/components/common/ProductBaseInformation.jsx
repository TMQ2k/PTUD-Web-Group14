import ProductBaseInformationCard from "./ProductBaseInformationCard";
import { useProduct } from "../../context/ProductDetailsContext";
import { formatCustomDate } from "../../utils/DateTimeCalculation";
import { formatNumberToCurrency } from "../../utils/NumberHandler";

const ProductBaseInformation = () => {
  const product = useProduct();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <ProductBaseInformationCard
        title="Người bán"
        value={product?.seller?.username || "None"}
        points={product?.seller?.points || null}
      />
      <ProductBaseInformationCard
        title="Người đấu giá cao nhất"
        value={product?.top_bidder?.name || "None"}
        points={product?.seller?.points || null}
      />
      <ProductBaseInformationCard
        title="Ngày đăng bán"
        value={formatCustomDate(product.created_at.toString())}
      />
      <ProductBaseInformationCard
        title="Ngày kết thúc"
        value={formatCustomDate(product.end_time.toString())}
      />
      <ProductBaseInformationCard
        title="Giá khởi điểm"
        value={formatNumberToCurrency(product.starting_price) + " đ"}
      />
      <ProductBaseInformationCard
        title="Bước giá"
        value={formatNumberToCurrency(product.step_price) + " đ"}
      />
      <ProductBaseInformationCard
        title="Giá cao nhất"
        value={formatNumberToCurrency(product.current_price) + " đ"}
      />
      <ProductBaseInformationCard
        title="Số lượt ra giá"
        value={product.history.length}
      />
    </div>
  );
};

export default ProductBaseInformation;
