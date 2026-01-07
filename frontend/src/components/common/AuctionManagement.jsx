// import { useEffect, useState } from "react";
// import { productApi } from "../../api/product.api";
// import { useParams, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { sellerApi } from "../../api/seller.api";
// import { userApi } from "../../api/user.api";
// import { BlinkBlur } from "react-loading-indicators";
// import ProductHistory from "./ProductHistory";
// import PendingBidsList from "./PendingBidsList";
// import BidderBannedList from "./BidderBannedList";
// import BidderRequests from "./BidderRequests";
// import BidderSearching from "./BidderSearching";

// const AuctionManagement = () => {
//   const params = useParams();
//   const { state } = useLocation();
//   const sellerId = state?.sellerId;
//   const productName = state?.productName;
//   const { userData } = useSelector((state) => state.user);
//   const [history, setHistory] = useState([]);
//   const [pendingList, setPendingList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bannedList, setBannedList] = useState([]);
//   const [searchList, setSearchList] = useState([]);

//   // const mockData = [
//   //   {
//   //     request_id: 1,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 1,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 2,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 2,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 3,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 3,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 4,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 4,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 5,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 5,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 6,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 6,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 106.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 7,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 7,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 8,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 8,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 9,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 9,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   //   {
//   //     request_id: 10,
//   //     product_id: 22,
//   //     product_name: "Laptop",
//   //     bidder_id: 10,
//   //     bidder_username: "thienphu",
//   //     bidder_rating: 10.0,
//   //     reason: "Nothing",
//   //     created_at: "2025-12-08T16:10:29.113Z",
//   //   },
//   // ];

//   // const MOCK_BIDS = [
//   //   {
//   //     bidder_id: 1,
//   //     masked_username: "Sarah Jenkins",
//   //     bid_amount: 450.0,
//   //     bid_time: "2023-10-27T10:30:00Z",
//   //   },
//   //   {
//   //     bidder_id: 2,
//   //     masked_username: "Michael Chen",
//   //     bid_amount: 425.5,
//   //     bid_time: "2023-10-27T10:25:00Z",
//   //   },
//   //   {
//   //     bidder_id: 3,
//   //     masked_username: "Alex Thompson",
//   //     bid_amount: 400.0,
//   //     bid_time: "2023-10-27T10:15:00Z",
//   //   },
//   //   {
//   //     bidder_id: 4,
//   //     masked_username: "Jessica Wu",
//   //     bid_amount: 350.0,
//   //     bid_time: "2023-10-27T09:45:00Z",
//   //   },
//   //   {
//   //     bidder_id: 5,
//   //     masked_username: "David Miller",
//   //     bid_amount: 320.0,
//   //     bid_time: "2023-10-27T09:30:00Z",
//   //   },
//   // ];

//   const isSeller = userData?.role === "seller";

//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const [pendingResponse, historyResponse, bannedRespone] = await Promise.all([
//           isSeller
//             ? sellerApi.getBiddersPendingList(params.id)
//             : Promise.resolve(null),
//           productApi.getProductBiddingHistory(params.id),
//           productApi.getBannedList(params.id),
//         ]);
//         if (isMounted) {
//           setPendingList(pendingResponse?.data?.requests || []);
//           setHistory(historyResponse?.data || []);
//           setBannedList(bannedRespone?.data || []);
//         }
//       } catch (err) {
//         if (isMounted) setError(err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, [params.id, isSeller]);

//   const handleAuctionManagement = async (bidder_id, callback) => {
//     const respone = await callback(params.id, bidder_id);
//     return respone.data;
//   }

//   const handleAccept = async (bidder_id) => {
//     return await handleAuctionManagement(bidder_id, sellerApi.acceptBidder);
//   }

//   const handleReject = async (bidder_id) => {
//     return await handleAuctionManagement(bidder_id, sellerApi.rejectBidder);
//   }

//   const handleUnban = async (bidder_id) => {
//     return await handleAuctionManagement(bidder_id, sellerApi.deleteBannedBidder);
//   }

//   const handleSearch = async (target_name) => {
//     const respone = await userApi.searchByName(target_name);
//     if (respone?.code === 200 && respone?.data) setBannedList(respone.data);
//   }

//   return (
//     <>
//       {loading && (
//         <div className="h-screen w-full flex items-center justify-center">
//           <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
//         </div>
//       )}
//       {error && <div>{error.message}</div>}
//       {!loading && !error && (
//         <>
//           <ProductHistory
//             auctionHistory={history}
//             productName={productName}
//           />
//           {userData?.role === "seller" && userData?.id === sellerId && (
//             // <PendingBidsList
//             //   requests={pendingList}
//             //   bidderList={history}
//             //   bannedBidders={bannedList}
//             //   productName={productName}
//             // />
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <BidderRequests
//                 requests={pendingList}
//                 handleAcceptRequest={handleAccept}
//               />
//               <BidderSearching
//                 searchList={searchList}
//                 handleBan={handleReject}
//                 handleSearch={handleSearch}
//               />
//               <BidderBannedList
//                 bannedList={bannedList}
//                 handleUnban={handleUnban}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default AuctionManagement;

import { useEffect, useState } from "react";
import { productApi } from "../../api/product.api";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { sellerApi } from "../../api/seller.api";
import { userApi } from "../../api/user.api";
import { BlinkBlur } from "react-loading-indicators";
import { Gavel, ShieldAlert, UserPlus, Search } from "lucide-react"; // Added icons
import ProductHistory from "./ProductHistory";
import BidderBannedList from "./BidderBannedList";
import BidderRequests from "./BidderRequests";
import BidderSearching from "./BidderSearching";
import Spinner from "./Spinner";
import ErrorModal from "./ErrorModal";

const AuctionManagement = () => {
  const params = useParams();
  const { state } = useLocation();
  const sellerId = state?.sellerId;
  const productName = state?.productName;
  const { userData } = useSelector((state) => state.user);

  const [history, setHistory] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [bannedList, setBannedList] = useState([]);
  const [searchList, setSearchList] = useState([]); // This stores results from the search component

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSeller = userData?.role === "seller";

  // --- Data Loading ---
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pendingResponse, historyResponse, bannedResponse] =
          await Promise.all([
            isSeller
              ? sellerApi.getBiddersPendingList(params.id)
              : Promise.resolve(null),
            productApi.getProductBiddingHistory(params.id),
            productApi.getBannedList(params.id),
          ]);

        if (isMounted) {
          if (pendingResponse?.data?.requests && bannedResponse?.data) {
            const pending = pendingResponse.data.requests;
            const banned = bannedResponse.data;
            console.log(pending);
            console.log(banned);
            setPendingList(
              pending.filter(
                (p) => !banned.some((b) => b.user_id == p.bidder_id)
              )
            );
            setBannedList(bannedResponse.data);
          }
          //if (pendingResponse?.data?.requests) setPendingList(pendingResponse.data.requests);
          if (historyResponse?.data) setHistory(historyResponse.data);
          //if (bannedResponse?.data) setBannedList(bannedResponse.data);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [params.id, isSeller]);

  // --- Handlers ---
  const refreshData = async () => {
    // Optional: Helper to re-fetch data after an action without full reload
    // For now, we update local state optimistically or re-fetch logic could go here
  };

  const handleAuctionAction = async (bidder_id, apiCall) => {
    try {
      const response = await apiCall(params.id, bidder_id);
      // Simple optimistic update: remove the processed item from lists
      // setPendingList(prev => prev.filter(item => item.bidder_id !== bidder_id));
      // setBannedList(prev => prev.filter(item => item.user_id !== bidder_id));
      return response.data;
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const handleAccept = (bidder_id) => {
    handleAuctionAction(bidder_id, sellerApi.acceptBidder);
    setPendingList((prev) =>
      prev.filter((item) => item.bidder_id !== bidder_id)
    );
  };
  const handleReject = (bidder_id) => {
    handleAuctionAction(bidder_id, sellerApi.rejectBidder);
    const rejectedBidder = searchList.find((item) => item.user_id === bidder_id);
    setSearchList((prev) => prev.filter((item) => item.user_id !== bidder_id));  
    if (rejectedBidder) setBannedList((prev) => [...prev, rejectedBidder]);
  };
  const handleUnban = (bidder_id) => {
    handleAuctionAction(bidder_id, sellerApi.deleteBannedBidder);
    setBannedList((prev) => prev.filter((item) => item.user_id !== bidder_id));
  };

  const handleSearch = async (target_name) => {
    if (!target_name) return;
    try {
      const response = await userApi.searchByName(target_name);
      if (response?.code === 200 && response?.data) {
        setSearchList(response.data);
      }
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error)
    return (
      <ErrorModal
        defaultMessage={"Hệ thống không thể tải trang này"}
        error={error}
      />
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Gavel className="text-blue-600" />
          Quản lý đấu giá:{" "}
          <span className="text-blue-600 font-normal">{productName}</span>
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: History (Assuming it takes full height or prominent space) */}
        <div className="lg:col-span-3">
          <ProductHistory auctionHistory={history} productName={productName} />
        </div>

        {/* Management Panels - Only for Owner Seller */}
        {isSeller && userData?.id === sellerId && (
          <>
            {/* 1. Requests Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-100 bg-blue-50/50 flex items-center gap-2">
                <UserPlus className="size-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">
                  Yêu cầu tham gia
                </h2>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingList.length}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <BidderRequests
                  requests={pendingList}
                  handleAcceptRequest={handleAccept}
                />
              </div>
            </div>

            {/* 2. Search & Ban Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-100 bg-purple-50/50 flex items-center gap-2">
                <Search className="size-5 text-purple-600" />
                <h2 className="font-semibold text-gray-800">Tìm kiếm & Cấm</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <BidderSearching
                  searchList={searchList}
                  handleBan={handleReject}
                  handleSearch={handleSearch}
                />
              </div>
            </div>

            {/* 3. Banned List Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-100 bg-red-50/50 flex items-center gap-2">
                <ShieldAlert className="size-5 text-red-600" />
                <h2 className="font-semibold text-gray-800">Danh sách chặn</h2>
                <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  {bannedList.length}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <BidderBannedList
                  bannedList={bannedList}
                  handleUnban={handleUnban}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionManagement;
