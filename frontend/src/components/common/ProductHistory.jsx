import React from "react";
import { useEffect, useState } from "react";
import { productApi } from "../../api/product.api";
import { useParams, Link } from "react-router-dom";
import { formatCustomDate } from "../../utils/DateTimeCalculation";
import { formatNumberToCurrency } from "../../utils/NumberHandler";
import { SquareArrowOutUpRight } from "lucide-react";
import { BlinkBlur } from "react-loading-indicators";

const ProductHistory = React.memo(({auctionHistory, productName}) => {
  const params = useParams();  

  // useEffect(() => {
  //   let isMounted = true;
  //   const MOCK_BIDS = [
  //     {
  //       masked_username: "Sarah Jenkins",
  //       bid_amount: 450.0,
  //       bid_time: "2023-10-27T10:30:00Z",
  //     },
  //     {
  //       masked_username: "Michael Chen",
  //       bid_amount: 425.5,
  //       bid_time: "2023-10-27T10:25:00Z",
  //     },
  //     {
  //       masked_username: "Alex Thompson",
  //       bid_amount: 400.0,
  //       bid_time: "2023-10-27T10:15:00Z",
  //     },
  //     {
  //       masked_username: "Jessica Wu",
  //       bid_amount: 350.0,
  //       bid_time: "2023-10-27T09:45:00Z",
  //     },
  //     {
  //       masked_username: "David Miller",
  //       bid_amount: 320.0,
  //       bid_time: "2023-10-27T09:30:00Z",
  //     },
  //   ];

  //   const loadHistory = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       // Note: keeping your logic where you fetch but overwrite with mock data
  //       const response = await productApi.getProductBiddingHistory(params.id);
  //       console.log(response);

  //       if (isMounted) {
  //         setHistory(MOCK_BIDS);
  //       }
  //     } catch (err) {
  //       if (isMounted) setError(err);
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   };

  //   loadHistory();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [params.id]);  

  return (
    <>        
      <div className="w-[80%] mx-auto my-10 font-sans grid-cols-2">
        {/* Card Container */}
        <div className="bg-white col-span-1 shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden border border-slate-100">
          {/* Header - Clean and Minimal */}
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-linear-to-br from-blue-400 to-purple-600">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg
                  className="size-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start justify-start gap-1">
                <h2 className="font-bold text-2xl text-white">{productName}</h2>
                <h2 className="font-bold text-indigo-900 text-xl">Lịch sử đấu giá</h2>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                  {auctionHistory.length} Total Bids
                </span>
              </div>
            </div>
            <Link
              to={`/products/${params.id}`}
              className="px-4 py-2 text-sm rounded-xl font-semibold hover:scale-102 active:scale-98 hover:shadow-xl transition-all duration-200 hover:text-blue-500 bg-white flex flex-row items-center gap-2"
            >
              <SquareArrowOutUpRight className="size-5"/>
              Quay về trang chi tiết
            </Link>
          </div>

          {/* List Container */}
          <ul className="divide-y divide-slate-50">
            {auctionHistory && auctionHistory.length > 0 && auctionHistory.map((bid, index) => {
              const isTopBid = index === 0;

              return (
                <li
                  key={index}
                  className={`
                    relative px-6 py-4 transition-all duration-300
                    ${
                      isTopBid
                        ? "bg-indigo-100 hover:bg-indigo-200"
                        : "hover:bg-slate-50"
                    }
                  `}
                >
                  {/* Gold accent line for winner */}
                  {isTopBid && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r"></div>
                  )}

                  <div className="flex justify-between items-center">
                    {/* Left: Avatar & Name */}
                    <div className="flex items-center gap-4">
                      {/* Avatar Circle */}
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border
                        ${
                          isTopBid
                            ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                            : "bg-slate-100 border-slate-200 text-slate-500"
                        }
                      `}
                      >
                        {/* Get first letter of username */}
                        #{index + 1}
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold ${
                            isTopBid ? "text-blue-700" : "text-blue-500"
                          }`}
                        >
                          {bid.masked_username}
                        </span>
                        <span className="text-xs text-black mt-0.5">
                          {formatCustomDate(bid.bid_time)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right">
                      <div
                        className={`
                        font-mono font-bold text-lg tracking-tight
                        ${isTopBid ? "text-indigo-600" : "text-slate-700"}
                      `}
                      >
                        {formatNumberToCurrency(Number(bid.bid_amount))}
                      </div>
                      {isTopBid && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full mt-1">
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          HIGHEST
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>              
      </div>    
    </>
  );
});

export default ProductHistory;
