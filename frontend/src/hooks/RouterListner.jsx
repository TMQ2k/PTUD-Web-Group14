import { useEffect } from "react"
import { sellerApi } from "../api/seller.api"

const RouterListner = () => {

  useEffect(() => {
    const listenNavigation = async () => {
      await sellerApi.updateUserRole();
      //console.log("Navigate");
    }

    listenNavigation();
  }, [])

  return null;
}

export default RouterListner;