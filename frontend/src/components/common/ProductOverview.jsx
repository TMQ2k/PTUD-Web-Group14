// import { twMerge } from "tailwind-merge";
// import { useEffect } from "react";
// import { useProduct } from "../../context/ProductDetailsContext";
// import { useQuill } from "react-quilljs";
// import ProductBaseInformation from "./ProductBaseInformation";

// const OverviewSection = ({ title, children, className = "" }) => {
//   return (
//     <section className={twMerge("w-full", className)}>
//       <h3 className="text-2xl text-blue-600 font-semibold">{title}</h3>
//       {children}
//     </section>
//   );
// };

// const ProductOverview = () => {
//   const { quill, quillRef } = useQuill();

//   const product = useProduct();
//   const description = JSON.parse(product.description);
//   useEffect(() => {
//     if (quill) {
//       quill.setContents(description);
//       //quill.editReadOnly();
//       // quill.on('text-change', (delta, oldDelta, source) => {
//       // });
//     }
//   }, [quill, quillRef, description]);

//   return (
//     <article className="flex flex-col gap-5 bg-slate-100
//                         hover:shadow-black/20 transition-all duration-300 rounded-md py-5 pl-5 pr-2
//                         text-balance">
//       <OverviewSection title="Mô tả từ người bán">
//         <div style={{ width: 500, height: 200, border: '2px solid blue', borderRadius: '5px', }}>
//           <div ref={quillRef} />
//         </div>
//       </OverviewSection>
//       {/* <OverviewSection title="Mô tả từ người bán">
//         <p className="text-pretty font-semibold">{product.description}</p>
//       </OverviewSection> */}
//       <OverviewSection title="Thông tin chung">
//         <ProductBaseInformation />
//       </OverviewSection>
//     </article>
//   );
// };

// export default ProductOverview;

import { twMerge } from "tailwind-merge";
import { useEffect, useState, Activity } from "react";
import { useProduct } from "../../context/ProductDetailsContext";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Ensure CSS is imported
import ProductBaseInformation from "./ProductBaseInformation";
import { productApi } from "../../api/product.api";
import { useSelector } from "react-redux";

const OverviewSection = ({ title, children, className = "" }) => {
  return (
    <section className={twMerge("w-full mb-6", className)}>
      <h3 className="text-2xl text-blue-600 font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
};

const ProductOverview = () => {
  const product = useProduct();
  const [isAppending, setIsAppending] = useState(false);
  const { userData } = useSelector((state) => state.user);

  // --------------------------------------------------------
  // 1. VIEW ONLY EDITOR (The "Old" Content)
  // --------------------------------------------------------
  const { quill: viewQuill, quillRef: viewRef } = useQuill({
    readOnly: true,
    modules: { toolbar: false }, // Hide toolbar for clean view
  });

  // Load initial data from Product Context
  useEffect(() => {
    if (viewQuill && product?.description) {
      try {
        const descriptionDelta =
          typeof product.description === "string"
            ? JSON.parse(product.description)
            : product.description;
        // const finalDescriptionDelta = typeof product.description === "string"
        //   ? JSON.parse(descriptionDelta)
        //   : descriptionDelta
        //console.log(finalDescriptionDelta)
        viewQuill.setContents(descriptionDelta);
      } catch (error) {
        console.error("Error loading description:", error);
      }
    }
  }, [viewQuill, product]);

  // --------------------------------------------------------
  // 2. APPEND EDITOR (The "New" Content Input)
  // --------------------------------------------------------
  const { quill: appendQuill, quillRef: appendRef } = useQuill({
    placeholder: "Type additional details here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        ["link"],
        //["link", "image", "video", "formula"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ["clean"], // remove formatting button
      ],
    },
  });

  // --------------------------------------------------------
  // 3. MERGE LOGIC
  // --------------------------------------------------------
  const handleConfirmAppend = async (e) => {
    e.preventDefault();
    if (viewQuill && appendQuill) {
      const oldContent = viewQuill.getContents(); // Get current Delta
      const newContent = appendQuill.getContents(); // Get new Delta

      const combinedContent = oldContent.concat(newContent);

      appendQuill.setContents([]);
      setIsAppending(false);
      try {
        const respone = await productApi.updateDescription(
          product?.product_id,
          JSON.stringify(combinedContent)
        );
        if (respone.code === 200) viewQuill.setContents(combinedContent);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <article className="flex flex-col gap-5 bg-slate-100 hover:shadow-lg transition-all duration-300 rounded-md py-5 px-6 text-balance">
      <OverviewSection title="Mô tả từ người bán">
        <div className="bg-white rounded-lg border border-gray-200">
          <div
            ref={viewRef}
            style={{ minHeight: "150px", border: "none", width: "100%" }}
          />
        </div>
      </OverviewSection>

      {/* <div className="flex flex-col items-start gap-4 mb-6">
        {!isAppending ? (
          <button
            onClick={() => setIsAppending(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm thông tin mô tả
          </button>
        ) : (
          <form className="w-full bg-white p-4 rounded-lg border-2 border-blue-100 animate-fade-in-down">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Nội dung bổ sung:</h4>
            
            
            <div style={{ minHeight: 200, marginBottom: '50px' }}>
               <div ref={appendRef} />
            </div>

            <div className="flex gap-3 mt-4 justify-end">
              <button
                type="button"
                onClick={() => setIsAppending(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleConfirmAppend}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
              >
                Xác nhận & Gộp
              </button>
            </div>
          </form>
        )}
      </div> */}

      {/* {product?.seller?.id === userData.id && userData.role === "seller" && (
        <>
          <Activity mode={isAppending ? "hidden" : "visible"}>
            <button
              onClick={() => setIsAppending(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm thông tin mô tả
            </button>
          </Activity>
          <Activity mode={isAppending ? "visible" : "hidden"}>
            <form className="w-full bg-white p-4 rounded-lg border-2 border-blue-100 animate-fade-in-down">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Nội dung bổ sung:</h4>
                            
              <div style={{ minHeight: 200, marginBottom: '50px' }}>
                  <div ref={appendRef} />
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAppending(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  onClick={handleConfirmAppend}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Xác nhận & Gộp
                </button>
              </div>
              </form>
          </Activity>
        </>
      )}  */}

      {userData.id === product.seller.id && (
        <>
          <Activity mode={isAppending ? "hidden" : "visible"}>
            <button
              onClick={() => setIsAppending(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm thông tin mô tả
            </button>
          </Activity>
          <Activity mode={isAppending ? "visible" : "hidden"}>
            <form className="w-full bg-white p-4 rounded-lg border-2 border-blue-100 animate-fade-in-down">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                Nội dung bổ sung:
              </h4>

              <div style={{ minHeight: 200, marginBottom: "50px" }}>
                <div ref={appendRef} />
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAppending(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  onClick={handleConfirmAppend}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Xác nhận & Gộp
                </button>
              </div>
            </form>
          </Activity>
        </>
      )}

      <OverviewSection title="Thông tin chung">
        <ProductBaseInformation />
      </OverviewSection>
    </article>
  );
};

export default ProductOverview;
