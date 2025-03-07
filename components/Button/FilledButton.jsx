"use client";

const FilledButton = ({ label, onClick, style, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...style }}
      className="bg-[#005B96] border-2 border-[#005B96] rounded-[30px] text-white w-4/5 text-lg font-semibold no-underline p-4 mt-16 hover:bg-white hover:text-[#005B96] hover:border-[#005B96] transition duration-300 ease-in-out lg:w-1/5"
    >
      {label}
    </button>
  );
};
export default FilledButton;
