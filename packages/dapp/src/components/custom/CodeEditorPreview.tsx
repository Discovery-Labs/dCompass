import { Box, Button, useBoolean } from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
interface CodeEditorPreviewProps {
  code: string;
}

function CodeEditorPreview(props: CodeEditorPreviewProps) {
  const { code } = props;
  const [isPreview, setIsPreview] = useBoolean();
  const { getBorderColor, getBgColor } = useCustomColor();
  return (
    <>
      {code && (
        <Box>
          <Button
            variant={isPreview ? "outline" : "solid"}
            onClick={setIsPreview.toggle}
            size="xs"
          >
            Preview
          </Button>
        </Box>
      )}

      {code && isPreview && (
        <Box
          bgColor={getBgColor}
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
