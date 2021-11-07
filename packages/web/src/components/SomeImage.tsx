import { useColorMode, Image } from "@chakra-ui/react";

import MotionBox from "./motion/Box";

const SomeImage = () => {
  return (
    <>
      <MotionBox
        animate={{ y: 20, scale: 0.97 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        marginY={8}
        maxWidth={[240, 320]}
        marginX="auto"
      >
        <Image
          src="/dCompass-home.png"
          width={800}
          height={800}
          alt="Decentralized infrastructure"
        />
      </MotionBox>
    </>
  );
};

export default SomeImage;
