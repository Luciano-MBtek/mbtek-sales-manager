"use client";

import { Toggle } from "@/components/ui/toggle";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading2,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
} from "lucide-react";

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* Heading */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      {/* Bold */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* Strikethrough */}
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      {/* Underline */}
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      {/* Bullet List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>

      {/* Ordered List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* Insert Image */}
      <Toggle
        size="sm"
        onPressedChange={() => {
          const imageUrl =
            "https://24467819.fs1.hubspotusercontent-na1.net/hubfs/24467819/Logo%20Mbtek%20Transparency.png";
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }}
      >
        <ImageIcon className="h-4 w-4" />
      </Toggle>

      {/* Insert Link */}
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>
    </div>
  );
};
