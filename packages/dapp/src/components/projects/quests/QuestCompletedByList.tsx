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
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../../contexts/Web3Context";

function QuestCompletedByList({ completedBy }: { completedBy: string[] }) {
  const { core } = useContext(Web3Context);
  const [completedByWithUsername, setCompletedByWithUsername] = useState<
    {
      did: string;
      name: string | undefined;
    }[]
  >();
  useEffect(() => {
    async function getBasicProfilesByDids(dids: string[]): Promise<void> {
      const basicProfiles = await Promise.all(
        dids.map(async (did: string) => ({
          did,
          name: (await core.get("basicProfile", did))?.name,
        }))
      );
      return setCompletedByWithUsername(basicProfiles);
    }
    getBasicProfilesByDids(completedBy);
  }, [completedBy, core]);

  return (
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
          completedByWithUsername.map(({ did, name }) => (
            <Tr key={did}>
              <Td>{name || "Anonymous"}</Td>
              <Td>{did}</Td>
              <Td>
                <Tag colorScheme="orange">Unclaimed</Tag>
              </Td>
            </Tr>
          ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>Username</Th>
          <Th>DID</Th>
          <Th>Reward status</Th>
        </Tr>
      </Tfoot>
    </Table>
  );
}

export default QuestCompletedByList;
