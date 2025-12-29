import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import SellerProductCheckoutCard from "./SellerProductCheckoutCard";
import { Package } from "lucide-react";


const SellerProductCheckout = () => {
  const data = [
    {
      productId: 1004,
      name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
      price: 2250.0,
      productImageUrl:
        "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
      bidderImageUrl: 
        "https://inkythuatso.com/uploads/thumbnails/800/2023/03/hinh-anh-chuyen-tien-thanh-cong-vietcombank-1-07-12-28-47.jpg",      
      seller: {
        name: "RetroOptics Ltd.",
        id: 11,
      },            
      bidder: {
        username: "thienphu",
        email: "truongcongthienphu1910@gmai.com",
        address: "227 Nguyễn Văn Cừ",
      },
      status: "sent", // "invalid" - "sent" - "paid" - "received"
    },
    {      
      productId: 1004,
      name: "Vintage 1960s Leica M3 Rangefinder Camera with Summicron 50mm Lens (Excellent Condition)",
      price: 2250.0,
      productImageUrl:
        "https://images.unsplash.com/photo-1627639685507-358459789474?q=80&w=2070&auto=format&fit=crop",
      transactionImageUrl: null,        
      seller: {
        name: "RetroOptics Ltd.",
        id: 11,
      },            
      bidder: {
        username: "thienphu",
        email: "truongcongthienphu1910@gmai.com",
        address: "227 Nguyễn Văn Cừ",
      },
      status: "invalid", // "invalid" - "sent" - "paid" - "received"
    },
  ];  

  return (
    <>
      <h1 className="flex flex-row gap-2 justify-center items-center h-fit p-1 mt-4 ml-4 text-4xl font-bold text-transparent bg-linear-to-br from-amber-400 to-red-600 bg-clip-text ">
        <Package className="size-12 stroke-red-500 bg-red-200 p-2 rounded-full"/>
        Sản phẩm của bạn đang chờ xử lý
      </h1>
      <div className="flex flex-col justify-center items-center gap-4 my-4">
        {data.map((p) => (
          <SellerProductCheckoutCard 
            productId={p.productId}
            productName={p.name}
            productImage={p.productImageUrl}
            sellerName={p.seller.name}
            sellerId={p.seller.id}
            bidderUsername={p.bidder.username}
            bidderEmail={p.bidder.email}
            bidderAddress={p.bidder.address}
            transactionImage={p.bidderImageUrl}
            price={p.price}
            status={p.status}
          />
        ))}
      </div>
    </>
  );
}

export default SellerProductCheckout;