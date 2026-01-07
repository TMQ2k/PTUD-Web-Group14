import React from "react";

const ProductBaseInformationCard = React.memo(function ({ title, value, points=null }) {
  return (
    <div className="flex flex-col">
      <h4 className="text-sm text-slate-400">{title}</h4>
      <div className="flex flex-row gap-2 items-center">
        {value !== null ? (
          <p className="text-xl text-black font-semibold">{value}</p>  
        ) : (
          <p className="text-sm text-red-500 font-bold">Chưa có thông tin</p>
        )}
        
        {points !== null && (
          <div className="text-red-500 bg-red-200 rounded-lg px-2">
            <span className="font-bold">Points:</span> {points}
          </div>
        )}
      </div>      
    </div>
  );
});

export default ProductBaseInformationCard;