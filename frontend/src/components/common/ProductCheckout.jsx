import React from "react";
import ProductCheckoutCard from "./ProductCheckoutCard"; // Adjust path as needed

const ProductCheckout = () => {
  // Dummy data simulating a database response
  const wonItemData = {
    id: 101,
    name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
    price: 2450.0,
    imageUrl: "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
    seller: {
      name: "RetroOptics Ltd.",
    },
    // Using a placeholder image service for the QR code demonstration
    paymentQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BankTransfer:RetroOptics:ACC123456",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-8">
       <h1 className="text-3xl font-bold text-gray-800 mb-4">My Won Auctions</h1>

      {/* Render the card */}
      <ProductCheckoutCard
        productName={wonItemData.name}
        productImage={wonItemData.imageUrl}
        winningPrice={wonItemData.price}
        sellerName={wonItemData.seller.name}
        qrCodeUrl={wonItemData.paymentQrUrl}
      />

       {/* Another example to show list consistency */}
       <ProductCheckoutCard
        productName="MacBook Pro M3 Max - Space Black - 1TB"
        productImage="https://images.unsplash.com/photo-1611186871348-b1f6996a9420?q=80&w=2070&auto=format&fit=crop"
        winningPrice={3199.99}
        sellerName="TechLiquidators_USA"
        qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Paypal:TechLiq"
      />
    </div>
  );
};

export default ProductCheckout;