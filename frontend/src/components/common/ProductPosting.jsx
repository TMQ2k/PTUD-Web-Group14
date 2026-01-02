import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ProductFormContext from "./ProductFormContext";
import { categoryApi } from "../../api/category.api";
import { sellerApi } from "../../api/seller.api";
import { productApi } from "../../api/product.api";
import { BlinkBlur } from "react-loading-indicators";
import { parseIntFromCurrency } from "../../utils/NumberHandler";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EnableProductExtension from "./EnableProductExtension";

const ProductPosting = () => {
  const [systemCategories, setSystemCategories] = useState([]);
  const [sellerExpiredDate, setSellerExpiredDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const createdDate = new Date(Date.now());

  const [posted, setPosted] = useState(false);
  const [isExtended, setExtended] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [postedProductId, setPostedProductId] = useState(null);

  const onClick = () => setExtended(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const parentCategoriesRes = await categoryApi.getAllCategories();
        const sellerRes = await sellerApi.getSellerStartTime();

        if (isMounted) {
          const parentCategoriesData = parentCategoriesRes?.data;
          const sellerData = sellerRes?.data;
          //console.log(parentCategoriesRes);
          //console.log(parentCategoriesData);
          setSystemCategories(
            parentCategoriesData?.flatMap((parent) => parent.children)
          );
          const rawtime = sellerData?.fnc_get_seller_start_time;
          const datetime = new Date(rawtime);
          datetime.setDate(datetime.getDate() + 7);
          setSellerExpiredDate(datetime);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const methods = useForm({
    defaultValues: {
      product_name: "",
      categories: [],
      starting_price: null,
      step_price: null,
      buy_now_price: null,
      end_date: null,
      images: [],
      description: "",
    },
  });

  const [quillContents, setQuillContents] = useState(null);

  const onSubmit = async (data) => {
    //console.log(new Date(data.end_date).toISOString());
    const formData = new FormData();
    const productPayload = {
      name: data.product_name,
      description: JSON.stringify(quillContents),
      starting_price: parseIntFromCurrency(data.starting_price),
      step_price: parseIntFromCurrency(data.step_price),
      buy_now_price: data.buy_now_price
        ? parseIntFromCurrency(data.buy_now_price)
        : null,
      end_time: new Date(data.end_date).toISOString(),
      category_ids: data.categories,

      //images: data.images,
    };

    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((imageFile) => {
        // "images" is the key name the backend looks for (e.g. req.files['images'])
        formData.append("images", imageFile);
      });
    }

    //console.log(formData.get("images"));
    //Array.from(formData.getAll("images")).forEach((image) => console.log(image));
    console.log(formData.getAll("images"));

    formData.append("product_payload", JSON.stringify(productPayload));
    console.log(formData.get("product_payload"));

    const respone = await productApi.postProduct(formData);
    setPostedProductId(respone.data);

    setPosted(true);
  };

  return (
    <>
      {userData?.role !== "seller" && <Navigate to="/" />}
      {loading && (
        <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && (
        <div className="text-4xl font-semibold text-red-500">{error}</div>
      )}
      {!loading &&
        !error &&
        (posted ? (
          <>
            {!isExtended ? (
              <div className="max-w-2xl mx-auto p-20 my-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                <EnableProductExtension
                  productId={postedProductId}
                  onClick={onClick}
                />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto p-8 my-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-50 p-4">
                    <CheckCircle
                      className="w-16 h-16 text-green-500"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  Đăng bán thành công!
                </h2>

                {/* Subtext */}
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Sản phẩm{" "}
                  <span className="font-semibold text-gray-700">
                    "{methods.getValues("product_name")}"
                  </span>{" "}
                  của bạn đã được niêm yết và hiển thị với người mua.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">                  
                  <button
                    onClick={() => {
                      setPosted(false);
                      methods.reset();
                    }}
                    className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-linear-to-r
                         hover:from-blue-400 hover:to-purple-600 hover:text-white 
                         text-gray-700 font-medium rounded-lg transition-all duration-400
                         hover:scale-102 active:scale-98 hover:shadow-2xl"
                  >
                    Đăng sản phẩm khác
                  </button>
                  <Link
                    to={`/products/${postedProductId}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    View Product
                  </Link>
                </div>                
                <div className="mt-6">
                  <Link
                    to="/"
                    className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <FormProvider {...methods}>
            <ProductFormContext
              label="Đăng bán sản phẩm"
              buttonLabel="Đăng sản phẩm"
              onSubmit={methods.handleSubmit(onSubmit)}
              sellerExpiredTime={sellerExpiredDate}
              createdDate={createdDate}
              defaultCategories={systemCategories}
              setQuillContents={setQuillContents}
            />
          </FormProvider>
        ))}
    </>
  );
};

export default ProductPosting;
