import React from "react";
import { useForm } from "react-hook-form";
import {
  useProduct,
  useProductDispatch,
} from "../../context/ProductDetailsContext";
import {
  formatNumberToCurrency,
  parseIntFromCurrency,
  convert,
} from "../../utils/NumberHandler";
import { bidderApi } from "../../api/bidder.api";
import { GrSubtractCircle, GrAddCircle } from "react-icons/gr";

const BiddingForm = React.memo(({ price, steps, productId, onAutobidUpdate }) => {
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      bidder_price: formatNumberToCurrency(price),
    },
  });

  const onSubmit = async (data) => {
    const respone = await bidderApi.autobid(productId, parseIntFromCurrency(getValues("bidder_price")));
    await onAutobidUpdate();
  };

  //console.log(bidder_price);

  const onSubtract = () => {
    const value = parseIntFromCurrency(getValues("bidder_price"));
    //console.log(value);
    const new_bid = value - steps;
    setValue(
      "bidder_price",
      formatNumberToCurrency(new_bid >= 0 ? new_bid : value)
    );
  };
  const onAdd = () => {
    const value = parseIntFromCurrency(getValues("bidder_price"));
    setValue("bidder_price", formatNumberToCurrency(value + steps));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-row gap-4 justify-start items-center w-full"
    >      
      <div
        className="size-fit bg-blue-200/35 flex flex-row justify-center items-center 
                      rounded-lg border-blue-500 border-2 py-2 px-3 gap-2"
      >
        <input
          type="text"
          {...register("bidder_price", {
            onChange: (e) => {
              setValue("bidder_price", convert(e.target.value.trim()));
            },
          })}
          className="text-center text-2xl focus:outline-none max-w-40
                    font-semibold text-blue-500"
        />
        <span className="w-0.5 h-8 bg-blue-500"></span>
        <div className="bg-linear-to-r from-[#8711c1] to-[#2472fc] text-transparent bg-clip-text">
          VND
        </div>
      </div>              
      <button
        className="rounded-2xl size-fit cursor-pointer text-2xl text-center group"
        onClick={onAdd}
        type="button"
      >
        <GrAddCircle className=" size-8 group-hover:scale-110 stroke-blue-700" />
      </button>
      <button
        className="rounded-2xl size-fit cursor-pointer text-2xl text-center group"
        onClick={onSubtract}
        type="button"
      >
        <GrSubtractCircle className="size-8 group-hover:scale-110 stroke-blue-400" />
      </button>
      <button
        type="submit"
        className="w-full hover:scale-102 hover:shadow-lg active:scale-98 outline-offset-2 
                   outline-blue-500 active:outline-indigo-600
                   focus:outline-2 active:bg-indigo-600
                   cursor-pointer text-white px-3 py-2 bg-blue-500 rounded-lg"
      >
        Đấu giá
      </button>
    </form>
  );
});

export default BiddingForm;
