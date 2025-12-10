import { twMerge } from "tailwind-merge"
import { Link } from "react-router-dom"

const NavigateButton = ({ className="", to="/", children }) => {
  return (
    <Link to={to}
          className={twMerge(`hover:scale-102 cursor-pointer transition-all duration-200 `, className)}>
      {children}
    </Link>
  )
}

export default NavigateButton