import { Box, Button, useBoolean } from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface CodeEditorPreviewProps {
  code: string;
}

function CodeEditorPreview(props: CodeEditorPreviewProps) {
  const { code } = props;
  const [isPreview, setIsPreview] = useBoolean();
  const { codeEditorPreviewScheme, getBgColor } = useCustomColor();
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
          border={`8px solid ${getBgColor}`}
          borderRadius="4px"
          data-color-mode={codeEditorPreviewScheme}
        >
          <div className="wmde-markdown-var"></div>
          <MarkdownPreview source={code} />
        </Box>
      )}
    </>
  );
}

export default CodeEditorPreview;
