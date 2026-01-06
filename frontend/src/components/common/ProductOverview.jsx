import { twMerge } from "tailwind-merge";
import { useEffect, useState, Activity } from "react";
import { useProduct } from "../../context/ProductDetailsContext";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Ensure CSS is imported
import ProductBaseInformation from "./ProductBaseInformation";
import { productApi } from "../../api/product.api";
import { useSelector } from "react-redux";

const OverviewSection = ({ title, children, isTopBidder, className = "" }) => {
  return (
    <section className={twMerge("w-full mb-6", className)}>
      <h3
        className={twMerge(
          "text-2xl  font-semibold mb-3",
          isTopBidder ? "text-orange-500" : "text-blue-500"
        )}
      >
        {title}
      </h3>
      {children}
    </section>
  );
};

const ProductOverview = () => {
  const product = useProduct();
  const [isAppending, setIsAppending] = useState(false);
  const user = useSelector((state) => state.user);
  const isTopBidder =
    user.isLoggedIn && user.userData.id == product?.top_bidder?.id;

  const { quill: viewQuill, quillRef: viewRef } = useQuill({
    readOnly: true,
    modules: { toolbar: false },
  });

  useEffect(() => {
    if (viewQuill && product?.description) {
      try {
        const descriptionDelta =
          typeof product.description === "string"
            ? JSON.parse(product.description)
            : product.description;
        viewQuill.setContents(descriptionDelta);
      } catch (error) {
        console.error("Error loading description:", error);
      }
    }
  }, [viewQuill, product]);

  const { quill: appendQuill, quillRef: appendRef } = useQuill({
    placeholder: "Type additional details here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link"],

        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],

        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],

        ["clean"],
      ],
    },
  });
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
      <OverviewSection title="Mô tả từ người bán" isTopBidder={isTopBidder}>
        <div className="bg-white rounded-lg border border-gray-200">
          <div
            ref={viewRef}
            style={{ minHeight: "150px", border: "none", width: "100%" }}
          />
        </div>
      </OverviewSection>

      {user.isLoggedIn &&
        user.userData.role === "seller" &&
        user.userData.id === product.seller.id && (
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

      <OverviewSection title="Thông tin chung" isTopBidder={isTopBidder}>
        <ProductBaseInformation />
      </OverviewSection>
    </article>
  );
};

export default ProductOverview;
