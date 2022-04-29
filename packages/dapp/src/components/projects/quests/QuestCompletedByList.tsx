import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Tag,
  Box,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../contexts/Web3Context";

function QuestCompletedByList({
  completedBy,
  streamId,
  claimedByAddrs = [],
}: {
  completedBy: string[];
  claimedByAddrs?: string[];
  streamId: string;
}) {
  const { core, contracts } = useContext(Web3Context);
  const [claimedBy, setClaimedBy] = useState<string[]>(claimedByAddrs);

  const [completedByWithUsername, setCompletedByWithUsername] = useState<
    {
      did: string;
      name: string | undefined;
      cryptoAccounts: string[];
    }[]
  >();

  useEffect(() => {
    async function getClaimedBy() {
      if (contracts?.BadgeNFT) {
        const claimedByAddresses =
          await contracts.BadgeNFT.getAllAddrsByBadgeIDVersion(streamId, 0);

        console.log({ claimedByAddresses });

        return setClaimedBy([
          ...new Set([...claimedByAddrs, ...claimedByAddresses]),
        ]);
      }
    }
    getClaimedBy();
  }, [contracts, streamId, claimedByAddrs]);

  useEffect(() => {
    async function getBasicProfilesByDids(dids: string[]): Promise<void> {
      const basicProfiles = await Promise.all(
        dids.map(async (did: string) => ({
          did,
          name: (await core.get("basicProfile", did))?.name,
          cryptoAccounts: Object.keys(
            await core.get("cryptoAccounts", did)
          ).map((account) => account.split("@")[0]),
        }))
      );
      return setCompletedByWithUsername(basicProfiles);
    }
    getBasicProfilesByDids(completedBy);
  }, [completedBy, core]);

  return (
    <Box w="full" overflowX="auto">
      <Table variant="simple">
        <TableCaption>Quest completed by the users above</TableCaption>
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>DID</Th>
            <Th>Reward status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {completedByWithUsername &&
            completedByWithUsername.map(({ did, name, cryptoAccounts }) => {
              const isClaimed =
                claimedBy &&
                claimedBy.some((address) => cryptoAccounts.includes(address));
              return (
                <Tr key={did}>
                  <Td>{name || "Anonymous"}</Td>
                  <Td>{did}</Td>
                  <Td>
                    <Tag colorScheme={isClaimed ? "accentDark" : "orange"}>
                      {isClaimed ? "Claimed" : "Unclaimed"}
                    </Tag>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Username</Th>
            <Th>DID</Th>
            <Th>Reward status</Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
}

export default QuestCompletedByList;
