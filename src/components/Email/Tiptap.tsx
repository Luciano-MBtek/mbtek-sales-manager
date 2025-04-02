"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { MenuBar } from "./MenuBar";
import Heading from "@tiptap/extension-heading";

const Tiptap = ({
  content,
  onChange,
  readOnly = false,
}: {
  content: string;
  onChange: (richText: string) => void;
  readOnly?: boolean;
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
      }),
      Heading.configure({
        HTMLAttributes: { class: "text-xl font-bold", levels: [2] },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      OrderedList,
      ListItem,
      Image.configure({
        HTMLAttributes: {
          width: 126,
          height: 45,
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-blue-500 underline pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Underline,
    ],
    content: content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] max-h-[250px] overflow-y-auto border-input bg-back pl-4 pr-4 max-w-[730px]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-md p-2">
      {!readOnly && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="prose [&_p]:my-0  max-w-none" />
    </div>
  );
};

export default Tiptap;
