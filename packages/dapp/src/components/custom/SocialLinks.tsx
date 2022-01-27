import { HStack, Link, Icon } from "@chakra-ui/react";
import { BsGlobe } from "react-icons/bs";
import { SiTwitter, SiDiscord, SiGithub, SiGitbook } from "react-icons/si";

function SocialLinks({
  website,
  twitter,
  discord,
  github,
  gitbook,
}: {
  website?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  gitbook?: string;
}) {
  return (
    <HStack spacing={8} justifyContent="space-between">
      {website && (
        <Link target="_blank" href={website}>
          <Icon boxSize={8} as={BsGlobe} />
        </Link>
      )}
      {twitter && (
        <Link target="_blank" href={twitter}>
          <Icon boxSize={8} as={SiTwitter} />
        </Link>
      )}
      {discord && (
        <Link target="_blank" href={discord}>
          <Icon boxSize={8} as={SiDiscord} />
        </Link>
      )}
      {github && (
        <Link target="_blank" href={github}>
          <Icon boxSize={8} as={SiGithub} />
        </Link>
      )}
      {gitbook && (
        <Link target="_blank" href={gitbook}>
          <Icon boxSize={8} as={SiGitbook} />
        </Link>
      )}
    </HStack>
  );
}

export default SocialLinks;
