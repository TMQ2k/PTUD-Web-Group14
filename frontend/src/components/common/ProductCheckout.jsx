import React from "react";
import ProductCheckoutCard from "./ProductCheckoutCard"; // Adjust path as needed
import { Package } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductCheckout = () => {
  const { userData } = useSelector((state) => state.user);
  const role = userData?.role || "guest";

  const data = [
    {
      id: 101,
      productId: 1002,
      name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
      price: 2450.0,
      imageUrl:
        "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
      seller: {
        name: "RetroOptics Ltd.",
      },
      // Using a placeholder image service for the QR code demonstration
      paymentQrUrl:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BankTransfer:RetroOptics:ACC123456",
      status: "paid", // null - "paid" - "received"
    },
    {
      id: 102,
      productId: 1004,
      name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
      price: 2250.0,
      imageUrl:
        "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
      seller: {
        name: "RetroOptics Ltd.",
      },
      // Using a placeholder image service for the QR code demonstration
      paymentQrUrl:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BankTransfer:RetroOptics:ACC123456",
      status: null, // null - "invalid" - "sent" - "paid" - "received"
    },
  ];

  return (
    <>
      {role === "guest" && <Navigate to="/" />}
      <h1 className="flex flex-row gap-2 justify-center items-center h-fit p-1 mt-4 text-center text-4xl font-bold text-transparent bg-linear-to-br from-blue-400 to-purple-600 bg-clip-text ">
        <Package className="size-12 stroke-purple-500 bg-purple-200 p-2 rounded-full"/>
        Sản phẩm đã thắng
      </h1>
      <div className=" bg-gray-50 my-8 gap-8 flex flex-col justify-center items-center">
        {/* Render the card */}
        {data.map((p) => (
          <ProductCheckoutCard
            key={p.productId}
            productName={p.name}
            productImage={p.imageUrl}
            winningPrice={p.price}
            sellerName={p.seller.name}
            qrCodeUrl={p.paymentQrUrl}
            productId={p.productId}
            status={p.status}
          />
        ))}
      </div>
    </>
  );
};

export default ProductCheckout;
