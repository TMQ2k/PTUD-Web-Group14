import { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";

const WonUserInformation = ({ wonId, productId, onPaid }) => {
  const [bidderInfo, setBidderInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadBidderInformation = async () => {
      try {
        setLoading(true);
        setError(null);
        const respone = await onPaid(wonId, productId);
        if (isMounted) setBidderInfo(respone);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBidderInformation();

    return () => {
      isMounted = false;
    };
  }, [wonId, productId, onPaid]);

  return (
    <>
      {loading && (
        <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      )}
      {error && <div>{error?.message || "Can not get bidder information"}</div>}
      {!loading && !error && (
        <>
          <CheckCheck className="size-18 stroke-green-500" />
          <div className="flex flex-col gap-2">
            <h2 className="text-center font-bold text-lg ">
              Thông tin người thắng
            </h2>
            <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
              Bidder username:{" "}
              <span className="text-black font-semibold">
                {bidderInfo.username}
              </span>
            </p>
            <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
              Email:{" "}
              <span className="text-black font-semibold">
                {bidderInfo.email}
              </span>
            </p>
            <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
              SĐT:{" "}
              <span className="text-black font-semibold">
                {bidderInfo.phone_number}
              </span>
            </p>
            <p className="font-bold  text-amber-500 border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
              Địa chỉ:{" "}
              <span className="text-black font-semibold">
                {bidderInfo.address}
              </span>
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default WonUserInformation;
