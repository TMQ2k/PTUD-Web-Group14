import { useEffect } from "react";
import { sellerApi } from "../api/seller.api";
//import { useNavigate } from "react-router-dom";

const RouterListner = () => {

  useEffect(() => {
    const listenNavigation = async () => {
      await sellerApi.updateUserRole();
      //await productApi.deactiveExpiredProduct();
      //console.log("Navigate");
    }

    listenNavigation();
  }, [])

  return null;
}

export default RouterListner;