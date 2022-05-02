import { Button, chakra } from '@chakra-ui/react';
import { isValidMotionProp, motion, MotionConfig } from 'framer-motion';
import { FC } from 'react';

const ChakraButton1 = chakra(motion.button, {
  /**
   * Allow motion props and the children prop to be forwarded.
   * All other chakra props not matching the motion props will still be forwarded.
   */
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

const MotionButton: FC = () => {
  return (
    <>
      <ChakraButton1
        // @ts-ignore
        transition={{ duration: 0.2 }}
        bgColor="primary"
        borderRadius="full"
        p="2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        MotionButton
      </ChakraButton1>
    </>
  );
};

export default MotionButton;
