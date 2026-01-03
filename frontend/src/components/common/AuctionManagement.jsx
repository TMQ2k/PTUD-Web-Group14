import { useEffect, useState } from "react";
import { productApi } from "../../api/product.api";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { sellerApi } from "../../api/seller.api";
import { BlinkBlur } from "react-loading-indicators";
import ProductHistory from "./ProductHistory";
import PendingBidsList from "./PendingBidsList";

const AuctionManagement = () => {
  const params = useParams();
  const { state } = useLocation();
  const sellerId = state?.sellerId;
  const productName = state?.productName;
  const { userData } = useSelector((state) => state.user);
  const [history, setHistory] = useState([]);
  const [pendingList, setPendingList] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bannedList, setBannedList] = useState([]);

  // const mockData = [
  //   {
  //     request_id: 1,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 1,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 2,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 2,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 3,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 3,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 4,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 4,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 5,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 5,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 6,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 6,
  //     bidder_username: "thienphu",
  //     bidder_rating: 106.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 7,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 7,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 8,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 8,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 9,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 9,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  //   {
  //     request_id: 10,
  //     product_id: 22,
  //     product_name: "Laptop",
  //     bidder_id: 10,
  //     bidder_username: "thienphu",
  //     bidder_rating: 10.0,
  //     reason: "Nothing",
  //     created_at: "2025-12-08T16:10:29.113Z",
  //   },
  // ];

  // const MOCK_BIDS = [
  //   {
  //     bidder_id: 1,
  //     masked_username: "Sarah Jenkins",
  //     bid_amount: 450.0,
  //     bid_time: "2023-10-27T10:30:00Z",
  //   },
  //   {
  //     bidder_id: 2,
  //     masked_username: "Michael Chen",
  //     bid_amount: 425.5,
  //     bid_time: "2023-10-27T10:25:00Z",
  //   },
  //   {
  //     bidder_id: 3,
  //     masked_username: "Alex Thompson",
  //     bid_amount: 400.0,
  //     bid_time: "2023-10-27T10:15:00Z",
  //   },
  //   {
  //     bidder_id: 4,
  //     masked_username: "Jessica Wu",
  //     bid_amount: 350.0,
  //     bid_time: "2023-10-27T09:45:00Z",
  //   },
  //   {
  //     bidder_id: 5,
  //     masked_username: "David Miller",
  //     bid_amount: 320.0,
  //     bid_time: "2023-10-27T09:30:00Z",
  //   },
  // ];

  const isSeller = userData?.role === "seller";

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pendingResponse, historyResponse] = await Promise.all([
          isSeller
            ? sellerApi.getBiddersPendingList(params.id)
            : Promise.resolve(null),
          productApi.getProductBiddingHistory(params.id),
        ]);
        if (isMounted) {
          setPendingList(pendingResponse?.data?.requests || []);
          setHistory(historyResponse?.data || []);
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

  return (
    <>
      {loading && (
        <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <>
          <ProductHistory
            auctionHistory={history}
            productName={productName}
          />
          {userData?.role === "seller" && userData?.id === sellerId && (
            <PendingBidsList
              requests={pendingList}
              bidderList={history}
              bannedBidders={bannedList}
              productName={productName}
            />
          )}
        </>
      )}
    </>
  );
};

export default AuctionManagement;
