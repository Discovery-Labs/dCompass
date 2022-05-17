import { Box, Button, useBoolean } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import useCustomColor from "core/hooks/useCustomColor";
import ReactMarkdown from "react-markdown";
interface CodeEditorPreviewProps {
  code: string;
}

function CodeEditorPreview(props: CodeEditorPreviewProps) {
  const { code } = props;
  const [isPreview, setIsPreview] = useBoolean();
  const { getBorderColor } = useCustomColor();
  return (
    <>
      {code && (
        <Box>
          <Button
            variant={isPreview ? "outline" : "solid"}
            onClick={setIsPreview.toggle}
            size="xs"
          >
            Preview markdown
          </Button>
        </Box>
      )}

      {code && isPreview && (
        <Box
          bgColor="bg"
          border={`1px solid ${getBorderColor}`}
          borderRadius="4px"
          padding="4"
        >
          <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
            {code}
          </ReactMarkdown>
        </Box>
      )}
    </>
  );
}

export default CodeEditorPreview;
