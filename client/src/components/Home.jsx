import { motion } from "framer-motion";
import { styles } from "../styles";
import Letter from "../components/canvas/Letter";
import { MobileContext } from "../App";
import { useContext } from "react";
import letter_mobile from "../assets/letter-mobile.png";

const Home = () => {
  const isMobile = useContext(MobileContext);
  return (
    <section className="relative w-full min-h-screen bg-white dark:bg-background_dark">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[5%] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div>
          <h1
            className={`text-[40px] sm:text-[60px] text-black dark:text-white`}
          >
            Crafting <br /> Success,
            <br />
          </h1>
        </div>
      </div>
      <div className="absolute sm:z-1 bottom-[25%] sm:bottom-[120px] md:bottom-[100px] lg:bottom-[120px] right-2 sm:right-10 pr-10 pb-10">
        <span className="text-black font-semibold text-[40px] sm:text-[60px] dark:text-white">
          One Letter <br /> at a Time
        </span>
      </div>

      {!isMobile && <Letter />}
      {isMobile && (
        <div className="absolute z-2 h-full top-[80px] sm:top-[-20] w-full">
          <img src={letter_mobile} alt="letter" className="w-full" />
        </div>
      )}

      <div className="absolute bottom-20 sm:bottom-32 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary  flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Home;
