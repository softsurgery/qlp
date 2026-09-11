import React from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Maximize, Minimize } from "lucide-react";
import { RichTextEditor, Link, cn } from "@qlp/ui";
import { EditorFieldProps, Field } from "../types";

interface RichTextFieldProps {
  field: Field<EditorFieldProps>;
}

export const RichTextField = ({ field }: RichTextFieldProps) => {
  const { value, onChange, disabled, maxLength, height } = field.props || {};
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Link,
      Placeholder.configure({
        placeholder: field.placeholder || "Type here...",
      }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        "w-full rounded-md shadow-sm mt-1 border transition-all duration-200",
        field.error && "border-destructive focus-within:ring-destructive",
        isFullscreen &&
          "fixed inset-0 z-50 bg-background m-0 p-4 sm:p-6 w-full h-full overflow-hidden flex flex-col rounded-none border-none",
        !isFullscreen && field.className,
      )}
    >
      <RichTextEditor
        editor={editor}
        editable={!disabled}
        className={cn("bg-card", isFullscreen && "h-full flex flex-col flex-1")}
      >
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.CodeBlock />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignRight />
            <RichTextEditor.AlignJustify />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <div className="flex-1" />
          <RichTextEditor.ControlsGroup>
            <button
              type="button"
              className="rte-control-button text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content
          className={cn(
            "overflow-y-auto",
            !height && !isFullscreen && "min-h-[150px] max-h-[400px]",
            isFullscreen && "flex-1 h-full max-h-none min-h-0",
          )}
          style={
            !isFullscreen && height ? { height, minHeight: height } : undefined
          }
        />
      </RichTextEditor>
    </div>
  );
};
