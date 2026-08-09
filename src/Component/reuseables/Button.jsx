import { FaRegCalendarAlt } from "react-icons/fa";

const Button = ({disabled, text, icon: Icon,onClick, type, className=" bg-[#70c7ff] hover:text-black hover:scale-110 duration-500 transition-all cursor-pointer text-black" }) => {
   const baseClasses =
    "font-bold flex items-center justify-center gap-2 px-6 py-1 rounded-4xl text-sm";
  const withIconClasses = "bg-[#D1EAFA] text-[#1E1E1E]"; // different style for icon buttons
  const withoutIconClasses = className;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseClasses} ${
        Icon ? withIconClasses : withoutIconClasses
      } `}>
     {Icon && <FaRegCalendarAlt size={16} />}
      {text}
    </button>
  );
};

export default Button;