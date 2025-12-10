import React from "react";

const ProductBaseInformationCard = React.memo(function ({ title, value }) {
  return (
    <div className="flex flex-col">
      <h4 className="text-sm text-slate-400">{title}</h4>
      <p className="text-xl text-black font-semibold">{value}</p>
    </div>
  );
});

export default ProductBaseInformationCard;