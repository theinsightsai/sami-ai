"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DollarIcon } from "@/constants/assets";

const AnimatedCounter = ({ count }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(count, 10);

    if (isNaN(end)) return;

    const duration = 2000;
    const incrementTime = 50;
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(counter);
        start = end;
      }
      setDisplayCount(Math.floor(start));
    }, incrementTime);

    return () => clearInterval(counter);
  }, [count]);

  return (
    <motion.span animate={{ opacity: [0, 1] }}>
      {displayCount.toLocaleString()}
    </motion.span>
  );
};

const MainCard = ({ title, count, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="text-gray-500 text-lg font-medium">{title}</div>
      <div className="flex items-center text-[32px] font-bold mt-3">
        <DollarIcon />
        <AnimatedCounter count={count} />
      </div>
      <div
        className="pt-2 text-gray-500 mt-2"
        style={{ visibility: description === "" ? "hidden" : "visible" }}
      >
        {description !== "" ? description : "text help"}
      </div>
    </div>
  );
};

export default MainCard;
