import { Button, Input, Text, Flex } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import { Web3Context } from "contexts/Web3Provider";

type AddProjectWalletProps = {
  id: string;
};

function AddProjectWallet({ id }: AddProjectWalletProps) {
  const [projectWallet, setProjectWallet] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const level = "SILVER";
  const { contracts } = useContext(Web3Context);

  const onProjectWallet = (event: any) => setProjectWallet(event.target.value);
  const handleAddProjectWallet = async () => {
    if (id !== "" && projectWallet !== "") {
      try {
        setLoading(true);
        // console.log(
        //   `Adding Project Wallet ${projectWallet} with Level ${level} to: ${id}`
        // );
        await contracts?.projectNFTContract.addProjectWallet(
          id,
          projectWallet,
          level,
          {
            value: `0xde0b6b3a7640000`, // 1 eth
            // value: `0x2540BE400`, // small amount
          }
        );
        setEditMode(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    async function init() {
      if (contracts?.projectNFTContract) {
        const walletAddress = await contracts.projectNFTContract.projectWallets(
          id
        );
        setProjectWallet(walletAddress);
      }
    }
    init();
  }, [contracts?.projectNFTContract, id]);

  return (
    <>
      <Text>Add Project Wallet</Text>
      {editMode ? (
        <Flex>
          <Input
            value={projectWallet}
            onChange={onProjectWallet}
            placeholder="project Wallet"
          />
          <Button
            ml={2}
            colorScheme="secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button ml={2} isLoading={loading} onClick={handleAddProjectWallet}>
            Submit
          </Button>
        </Flex>
      ) : (
        <Flex>
          <Input isDisabled={true} value={projectWallet} />
          <Button ml={2} onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </Flex>
      )}
    </>
  );
}

export default AddProjectWallet;
