import { useState, useEffect } from "react";
import { sellerApi } from "../../api/seller.api";
import {
  Check,
  X,
  Star,
  AlertCircle,
  Package,
  ExternalLink,
  Ban,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mosaic } from "react-loading-indicators"

const PendingBidsList = () => {
  const params = useParams();
  const { register, getValues } = useForm();

  const mockData1 = [
    {
      request_id: 1,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 1,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 2,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 2,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 3,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 3,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 4,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 4,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 5,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 5,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 6,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 6,
      bidder_username: "thienphu",
      bidder_rating: 106.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 7,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 7,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 8,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 8,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 9,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 9,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 10,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 10,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
  ];

  const [pendingList, setPendingList] = useState(mockData1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bannedList, setBannedList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const mockData = [
    {
      request_id: 1,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 1,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 2,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 2,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 3,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 3,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 4,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 4,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 5,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 5,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 6,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 6,
      bidder_username: "thienphu",
      bidder_rating: 106.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 7,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 7,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 8,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 8,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 9,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 9,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
    {
      request_id: 10,
      product_id: 22,
      product_name: "Laptop",
      bidder_id: 10,
      bidder_username: "thienphu",
      bidder_rating: 10.0,
      reason: "Nothing",
      created_at: "2025-12-08T16:10:29.113Z",
    },
  ];

    const loadPendingList = async () => {
      try {
        setLoading(true);
        setError(null);

        const respone = sellerApi.getBiddersPendingList(params.id);
        if (isMounted) {
          setPendingList(respone?.data || mockData);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPendingList();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const handleAcception = async (bidder_id) => {
    try {
      //await sellerApi.acceptBidder(params.id, bidder_id);
      setPendingList((prev) => prev.filter((b) => b.bidder_id !== bidder_id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejection = async (bidder_id) => {
    try {
      //const reason = getValues(`reason-${bidder_id}`);
      //await sellerApi.rejectBidder(params.id, bidder_id, reason);
      const bidder = pendingList.find((b) => bidder_id === b.bidder_id);
      if (bidder) {
        setBannedList((prev) => [...prev, bidder]);
        setPendingList((prev) => prev.filter((b) => b.bidder_id !== bidder_id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletingBanned = async (bidder_id) => {
    try {
      //await sellerApi.deleteBannedBidder(params.id, bidder_id);
      setBannedList((prev) => prev.filter((b) => b.bidder_id !== bidder_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {loading && (<Mosaic color="#035efc" size="medium" text="" textColor="" />)}
      {error && <div>{error}</div>}
      {!loading && !error && (
        <div className="w-full mx-auto my-2 p-4 h-full">
          {/* --- UPDATED HEADER WITH NAVIGATION --- */}
          <div className="bg-linear-to-r from-blue-500  to-purple-600 rounded-xl shadow-sm border border-b-0 border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center md:items-center justify-between gap-4">
            {/* Left Side: Icon & Title */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white hover:scale-102 hover:shadow-white hover:shadow-2xl transition-all duration-300 text-purple-600 rounded-2xl shrink-0">
                <Package size={37} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight mb-1">
                  Product Name
                </h1>
                <p className="text-blue-100 mt-1">
                  Manage incoming bidder requests for this item.
                </p>
              </div>
            </div>

            {/* Right Side: Navigation Button */}
            <Link
              to={`/products/${params.id}`} // Replace with your actual route
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              View Product Details
              <ExternalLink size={16} />
            </Link>
          </div>

          {/* --- REQUEST LIST CONTAINER (Same as before) --- */}
          <div className="h-full py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-cyan-50 to-blue-100 rounded-3xl p-4 pr-1 shadow-xl border-4 border-cyan-300/50">
              <h2 className="text-2xl text-blue-600 font-semibold mb-2">
                Pending List
              </h2>
              <div className="max-h-[80vh] overflow-auto">
                {pendingList &&
                  pendingList.map((b) => (
                    <div
                      key={b.bidder_id}
                      className="bg-white/60 mb-2 mr-2 p-2 border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* CARD CONTENT */}
                      <div className="flex flex-row justify-between items-center mb-2">
                        <div className=" flex flex-col gap-2 items-start justify-center">
                          <div className="flex flex-row gap-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              {b.bidder_username}
                            </h3>
                            <span
                              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                b.bidder_rating > 10
                                  ? "bg-purple-100 text-purple-700"
                                  : b.bidder_rating > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Star size={10} fill="currentColor" />{" "}
                              {b.bidder_rating} pts
                            </span>
                          </div>
                          <p className="text-base text-amber-400 font-bold ">
                            Reason: <span className="text-black font-normal">{b.reason}</span>
                          </p>
                        </div>
                        <div className="flex flex-row justify-center gap-2">
                          <button
                            onClick={() => handleAcception(b.bidder_id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:scale-102 active:scale-98 bg-green-500 active:bg-green-600 text-white text-sm font-medium rounded-md transition-colors w-full sm:w-32"
                          >
                            <Check size={16} /> Accept
                          </button>
                          <button
                            onClick={() => handleRejection(b.bidder_id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:scale-102 active:scale-98 bg-white border border-gray-300 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium rounded-md transition-colors w-full sm:w-32"
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        {...register(`reason-${b.bidder_id}`)}
                        placeholder="Lý do từ chối"
                        className="w-full bg-white p-2 rounded-lg border-2 focus:border-2 focus:border-blue-500 focus:outline-none border-blue-200"
                      />                                                      
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-red-100 rounded-3xl p-4 pr-1 shadow-xl border-4 border-red-300/50">
              <h2 className="text-2xl font-semibold mb-2 text-red-500">
                Banned List
              </h2>
              <div className="overflow-auto max-h-[80vh]">
                {pendingList &&
                  bannedList.map((b) => (
                    <div
                      key={b.bidder_id}
                      className="bg-white mb-2 mr-2 border-2 border-red-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* CARD CONTENT */}

                      <div className="p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* User Details */}
                        <div className="flex items-start gap-4 flex-1 w-full">
                          <div className="w-full">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {b.bidder_username}
                              </h3>
                              <span
                                className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                  b.bidder_rating > 10
                                    ? "bg-purple-100 text-purple-700"
                                    : b.bidder_rating > 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <Star size={10} fill="currentColor" />{" "}
                                {b.bidder_rating} pts
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col md:flex-row items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto shrink-0">
                          <button
                            onClick={() => handleDeletingBanned(b.bidder_id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 hover:scale-102 active:scale-98 bg-red-500 active:bg-red-600 text-white text-sm font-medium rounded-md transition-colors w-full sm:w-32"
                          >
                            <Ban size={16} /> Unban
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingBidsList;
