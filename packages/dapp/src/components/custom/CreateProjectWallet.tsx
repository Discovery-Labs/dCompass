import { Button, Input, Text, Flex } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
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
  const [projectNFTContract, setProjectNFTContract] = useState<ProjectNFT>();

  const onProjectWallet = (event: any) => setProjectWallet(event.target.value);
  const handleAddProjectWallet = async () => {
    if (id !== "" && projectWallet !== "" && projectNFTContract) {
      try {
        setLoading(true);
        // console.log(
        //   `Adding Project Wallet ${projectWallet} with Level ${level} to: ${id}`
        // );
        await projectNFTContract.addProjectWallet(id, projectWallet, level, {
          value: `0xde0b6b3a7640000`,
        });
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
      if (contracts) {
        setProjectNFTContract(contracts.projectNFTContract);
      }
    }
    init();
  }, [contracts]);

  useEffect(() => {
    async function init() {
      if (projectNFTContract) {
        const walletAddress = await projectNFTContract.projectWallets(id);
        setProjectWallet(walletAddress);
      }
    }
    init();
  }, [projectNFTContract]);

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