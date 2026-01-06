// import React, { useState, useRef } from "react";
// import { ImagePlus } from "lucide-react";
// import { FourSquare } from "react-loading-indicators";
// import Image from "./Image";
// import { userApi } from "../../api/user.api";

// const QRcode = React.memo(
//   ({ sellerName, qrCodeUrl, productId, wonId, status, onImageUpload, onChangeStatus }) => {
//     const [pending, setPending] = useState(status);
//     const [previewImages, setPreviewImages] = useState(null);
//     const [image, setImage] = useState(null);
//     const ref = useRef();

//     const handleUpload = (e) => {
//       const files = Array.from(e.target.files);
//       if (files.length === 0) return;

//       const newPreviews = files.map((file) => ({
//         id: crypto.randomUUID(),
//         url: URL.createObjectURL(file),
//         file, // Keep original file for the form
//       }));

//       setPreviewImages(newPreviews);
//       // Only 1 image is uploaded
//       setImage(files[0]);
//     };

//     const handleRemove = async () => {
//       setPreviewImages(null);
//       setImage(null);

//       const updatedStatus = "invalid";
//       const respone = await onChangeStatus(wonId, updatedStatus);
//       if (respone.code === 200) setPending(updatedStatus);
//     };

//     const handleClick = async (e) => {
//       e.preventDefault();

//       const updatedStatus = "sent";
//       const formData = new FormData();
//       formData.append("payment_picture", image);
//       formData.append("wonId", wonId);
//       const uploadRespone = await userApi.uploadPaymentPicture(formData);
//       if (uploadRespone.code === 200) {
//         const statusRespone = await onChangeStatus(wonId, updatedStatus);
//         if (statusRespone.code === 200) setPending(updatedStatus);
//       }
//     };

//     return (
//       <>
//         {pending === "sent" && (
//           <div className="max-w-52 flex flex-col justify-center items-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
//             <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
//             <div className="text-wrap text-center font-semibold text-blue-500">
//               Giao dịch của bạn đang chờ người bán xử lý
//             </div>
//           </div>
//         )}
//         {pending === "invalid" &&
//           (image ? (
//             <div className="flex flex-col gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
//               {previewImages.map((img) => (
//                 <div
//                   key={img.id}
//                   className="relative size-28 group border-3 border-blue-400 rounded-lg"
//                 >
//                   <img
//                     src={img.url}
//                     alt="preview"
//                     className="w-full h-full object-cover rounded-lg border border-gray-200"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemove}
//                     className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:bg-red-50 transition-all border border-gray-200"
//                   >
//                     <svg
//                       className="w-3 h-3"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="3"
//                         d="M6 18L18 6M6 6l12 12"
//                       ></path>
//                     </svg>
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={handleClick}
//                 className="hover:scale-104 hover:shadow-xl active:scale-98 duration-300 transition-all w-full py-1 font-semibold text-white bg-linear-to-br from-blue-400 to-purple-600 rounded-lg"
//               >
//                 Gửi
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-row gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">
//               <div className="flex flex-col items-center">
//                 <Image src={qrCodeUrl} alt={"QR Code"} />
//                 <div className="mt-3 text-center">
//                   <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
//                     Pay to Seller
//                   </p>
//                   <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
//                     <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
//                     <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
//                       {sellerName}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center justify-center h-full gap-3">
//                 <button
//                   onClick={() => ref.current.click()}
//                   className="border-3 border-dashed border-blue-300 rounded-xl p-2 hover:bg-blue-50"
//                 >
//                   <ImagePlus className="size-20 stroke-blue-500 stroke-1" />
//                 </button>
//                 <p className="font-bold text-blue-400 bg-gray-100 border border-gray-200 text-sm px-2 py-1 rounded-full">
//                   Gửi ảnh giao dịch
//                 </p>
//                 <input
//                   hidden
//                   type="file"
//                   accept="image/*"
//                   ref={ref}
//                   onChange={handleUpload}
//                 />
//               </div>
//             </div>
//           ))}
//       </>
//     );
//   }
// );

// export default QRcode;

// {
//   /* <div className="flex flex-row gap-4 items-center justify-center pl-6 ml-2 border-l-2 border-dashed border-gray-200/70 shrink-0">          
//           <div className="flex flex-col items-center">
//             <div
//               onClick={() => setIsQrZoomed(true)}
//               className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group relative cursor-pointer"
//             >
//               <img
//                 src={qrCodeUrl}
//                 alt="Scan to Pay"
//                 className="size-24 object-contain rounded-lg group-hover:opacity-90 transition-opacity"
//               />
              
//               <div className="absolute inset-0 bg-blue-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <span className="text-white text-xs font-bold text-center">
//                   Click to
//                   <br />
//                   Enlarge
//                 </span>
//               </div>
//             </div>
//             <div className="mt-3 text-center">
//               <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
//                 Pay to Seller
//               </p>
//               <div className="flex items-center justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
//                 <div className="size-4 rounded-full bg-linear-to-tr from-blue-400 to-purple-600 mr-2"></div>
//                 <p className="text-sm font-bold text-gray-700 truncate max-w-[110px]">
//                   {sellerName}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-start h-full gap-3">
//             <button
//               onClick={() => ref.current.click()}
//               className="border-3 border-dashed border-blue-300 rounded-xl p-2 hover:bg-blue-50"
//             >
//               <ImagePlus className="size-20 stroke-blue-500 stroke-1" />
//             </button>
//             <p className="font-bold text-blue-400 bg-gray-100 border border-gray-200 text-sm px-2 py-1 rounded-full">
//               Gửi ảnh giao dịch
//             </p>
//             <input
//               hidden
//               type="file"
//               accept="image/*"
//               ref={ref}
//               onChange={handleUpload}
//             />
//           </div>
//         </div> */
// }


import React, { useState, useRef } from "react";
import { ImagePlus, X, Maximize2, ScanLine } from "lucide-react";
import { FourSquare } from "react-loading-indicators";
import { userApi } from "../../api/user.api";

const QRcode = React.memo(
  ({ sellerName, qrCodeUrl, productId, wonId, status, onChangeStatus }) => {
    const [pending, setPending] = useState(status);
    const [previewImages, setPreviewImages] = useState(null);
    const [image, setImage] = useState(null);
    const [isQrZoomed, setIsQrZoomed] = useState(false); // <--- Restored State
    const ref = useRef();

    const handleUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const newPreviews = files.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file, 
      }));

      setPreviewImages(newPreviews);
      setImage(files[0]);
    };

    const handleRemove = async () => {
      setPreviewImages(null);
      setImage(null);
    };

    const handleClick = async (e) => {
      e.preventDefault();
      const updatedStatus = "sent";
      const formData = new FormData();
      formData.append("payment_picture", image);
      formData.append("wonId", wonId);
      
      try {
        const uploadRespone = await userApi.uploadPaymentPicture(formData);
        if (uploadRespone.code === 200) {
          const statusRespone = await onChangeStatus(wonId, updatedStatus);
          if (statusRespone.code === 200) setPending(updatedStatus);
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    };

    // 1. LOADING / SENT STATE
    if (pending === "sent") {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2">
          <FourSquare color={["#60A5FA", "#A78BFA", "#34D399", "#FBBF24"]} size="small" />
          <span className="text-xs font-semibold text-center text-blue-500 max-w-[150px]">
            Đang chờ người bán xác nhận
          </span>
        </div>
      );
    }

    // 2. PREVIEW STATE (Image selected)
    if (image && previewImages) {
      return (
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          {previewImages.map((img) => (
            <div key={img.id} className="relative size-24 border-2 border-blue-400 rounded-lg group">
              <img
                src={img.url}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:scale-110 transition-transform"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={handleClick}
            className="w-full py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:shadow-md active:scale-95 transition-all"
          >
            Gửi xác nhận
          </button>
        </div>
      );
    }

    // 3. DEFAULT STATE (QR + Upload)
    return (
      <>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          {/* Left: QR Code (Clickable) */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsQrZoomed(true)}
              className="relative bg-white p-1 rounded-lg border border-gray-200 shadow-sm group overflow-hidden transition-all hover:border-blue-300 hover:shadow-md"
              title="Click to expand"
            >
              <img src={qrCodeUrl} alt="QR" className="size-20 object-contain" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <Maximize2 className="text-white size-5" />
                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Phóng to</span>
              </div>
            </button>
            
            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full max-w-[100px]">
              <div className="size-2 rounded-full bg-blue-500 shrink-0"></div>
              <p className="text-[10px] font-bold text-gray-600 truncate">
                {sellerName}
              </p>
            </div>
          </div>

          {/* Right: Upload Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => ref.current.click()}
              className="
                size-16 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 
                flex flex-col items-center justify-center gap-1
                hover:bg-blue-100 hover:border-blue-400 transition-all group
              "
            >
              <ImagePlus className="size-6 text-blue-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[10px] font-bold text-blue-500 text-center leading-tight">
              Gửi ảnh<br/>giao dịch
            </span>
            <input
              hidden
              type="file"
              accept="image/*"
              ref={ref}
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* --- ZOOM MODAL (Portal-like behavior) --- */}
        {isQrZoomed && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
               onClick={() => setIsQrZoomed(false)}
             ></div>

             {/* Content */}
             <div className="relative bg-white rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-4 max-w-sm w-full">
                <div className="flex justify-between items-center w-full">
                   <div className="flex items-center gap-2 text-gray-700 font-bold">
                      <ScanLine className="text-blue-500" />
                      Quét mã để thanh toán
                   </div>
                   <button 
                     onClick={() => setIsQrZoomed(false)}
                     className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                   >
                     <X className="text-gray-500" />
                   </button>
                </div>

                <div className="bg-white p-2 rounded-xl border-2 border-blue-100 shadow-inner">
                   <img src={qrCodeUrl} alt="Large QR" className="size-64 object-contain" />
                </div>

                <div className="text-center">
                   <p className="text-sm text-gray-500 uppercase tracking-widest text-[10px]">Seller</p>
                   <p className="font-bold text-lg text-gray-800">{sellerName}</p>
                </div>

                <p className="text-xs text-gray-400 text-center max-w-[200px]">
                  Sử dụng ứng dụng ngân hàng của bạn để quét mã này.
                </p>
             </div>
          </div>
        )}
      </>
    );
  }
);

export default QRcode;