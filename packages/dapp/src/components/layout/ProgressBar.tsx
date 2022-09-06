import { HStack, Link, Progress } from "@chakra-ui/react";

interface ProgressBarProps {
  progress: number;
  max: number;
  hasStripe?: boolean;
}

const ProgressBar = ({ progress, max, hasStripe = true }: ProgressBarProps) => {
  return (
    <HStack w="full">
      <Link href="/" />
      {progress === max ? (
        <Progress colorScheme="green" max={max} w="full" value={progress} />
      ) : (
        <Progress
          max={max}
          isAnimated
          hasStripe={hasStripe}
          w="full"
          value={progress}
        />
      )}
    </HStack>
  );
};

export default ProgressBar;
