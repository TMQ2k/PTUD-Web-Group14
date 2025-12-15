import React, { useState, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { FourSquare } from "react-loading-indicators";

const QRcode = React.memo(({ sellerName, qrCodeUrl, productId, status }) => {
  const [pending, setPending] = useState(status);
  const [isQrZoomed, setIsQrZoomed] = useState(false);  
  const [previewImages, setPreviewImages] = useState(null);
  const [image, setImage] = useState(null);
  const ref = useRef();  

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;    

    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file, // Keep original file for the form
    }));

    setPreviewImages(newPreviews);
    // Only 1 image is uploaded
    setImage(files[0]);
  };

  const handleRemove = () => {
    setPreviewImages(null);
    setImage(null);
    setPending(null);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setPending("sent");
    
  };

  return (
    <>
      {pending === "sent" && (
        <div className="max-w-52 flex flex-col justify-center items-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
          <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
          <div className="text-wrap text-center font-semibold text-blue-500">
            Giao dịch của bạn đang chờ người bán xử lý
          </div>
        </div>
      )}
      {(pending === null || pending === "invalid") && (image ? (
       <div className="flex flex-col gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
          {previewImages.map((img) => (
            <div
              key={img.id}
              className="relative size-28 group border-3 border-blue-400 rounded-lg"
            >
              <img
                src={img.url}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:bg-red-50 transition-all border border-gray-200"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={handleClick}
            className="hover:scale-104 hover:shadow-xl active:scale-98 duration-300 transition-all w-full py-1 font-semibold text-white bg-linear-to-br from-blue-400 to-purple-600 rounded-lg"
          >
            Gửi
          </button>
        </div>        
      ) : (
        <div className="flex flex-row gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">         
          <div className="flex flex-col items-center">
            <div
              onClick={() => setIsQrZoomed(true)}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative cursor-pointer"
            >
              <img
                src={qrCodeUrl}
                alt="Scan to Pay"
                className="size-24 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
              />              
              <div className="absolute inset-0 bg-blue-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold text-center">
                  Click to
                  <br />
                  Enlarge
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                Pay to Seller
              </p>
              <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
                <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
                  {sellerName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <button
              onClick={() => ref.current.click()}
              className="border-3 border-dashed border-blue-300 rounded-xl p-2 hover:bg-blue-50"
            >
              <ImagePlus className="size-20 stroke-blue-500 stroke-1" />
            </button>
            <p className="font-bold text-blue-400 bg-gray-100 border border-gray-200 text-sm px-2 py-1 rounded-full">
              Gửi ảnh giao dịch
            </p>
            {pending === "invalid" && (
              <p className="text-red-500 font-bold text-xs rounded-full bg-red-100 px-2 py-1">
                Ảnh thanh toán không hợp lệ
              </p>
            )}
            <input
              hidden
              type="file"
              accept="image/*"
              ref={ref}
              onChange={handleUpload}
            />
          </div>
        </div>
      ))}
      

      {isQrZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsQrZoomed(false)} // Clicking anywhere closes it
        >
          <div
            className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Scan to Pay
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Open your banking app and scan this code
            </p>

            {/* The Large QR Code */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mx-auto">
              <img
                src={qrCodeUrl}
                alt="Full Size QR"
                className="w-full h-auto object-contain"
              />
            </div>

            <button
              onClick={() => setIsQrZoomed(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default QRcode;


{/* <div className="flex flex-row gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">          
          <div className="flex flex-col items-center">
            <div
              onClick={() => setIsQrZoomed(true)}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative cursor-pointer"
            >
              <img
                src={qrCodeUrl}
                alt="Scan to Pay"
                className="size-24 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
              />
              
              <div className="absolute inset-0 bg-blue-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold text-center">
                  Click to
                  <br />
                  Enlarge
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                Pay to Seller
              </p>
              <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
                <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
                  {sellerName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start h-full gap-3">
            <button
              onClick={() => ref.current.click()}
              className="border-3 border-dashed border-blue-300 rounded-xl p-2 hover:bg-blue-50"
            >
              <ImagePlus className="size-20 stroke-blue-500 stroke-1" />
            </button>
            <p className="font-bold text-blue-400 bg-gray-100 border border-gray-200 text-sm px-2 py-1 rounded-full">
              Gửi ảnh giao dịch
            </p>
            <input
              hidden
              type="file"
              accept="image/*"
              ref={ref}
              onChange={handleUpload}
            />
          </div>
        </div> */}