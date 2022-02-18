import { Button, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";

type CreateTokenProps = {
  contract: ProjectNFT;
};

function CreateToken({ contract }: CreateTokenProps) {
  const firstURIParts = [
    "0x01701220",
    "0x01701220",
    "0x01701220",
    "0x01701220",
  ];
  const secondURIParts = [
    "0x8cb97a00a6c90a14ecf182d8363583d402f69919e38f0498edd9d92a5c02a7b4",
    "0xaaee392e31f4dc5c9aba87c950b4208b71eb628a0d76137317337faa9084beef",
    "0x7d836ef7074053a1e29f313f86e45e7d736c8aedb37c9d9ef9a748b6708978ef",
    "0xf4ae025d8039f4914e27df2749b9f07763e8daa85947e1b8f462620e73d71015",
  ];

  const PROJECT_ID = "test1";

  const handleCreateToken = async () => {
    try {
      await contract.createToken(firstURIParts, secondURIParts, PROJECT_ID);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Text>Create Token</Text>

      <Button onClick={handleCreateToken}>Create Token</Button>
    </>
  );
}

export default CreateToken;
