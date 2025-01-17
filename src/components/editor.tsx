"use client";

import Quill, { Delta, Op, type QuillOptions } from "quill";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import Hint from "./hint";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder = "Shoot...",
  defaultValue,
  disabled = false,
  innerRef,
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["link"],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({
                  body,
                  image: addedImage,
                });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = "";
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-50",
        )}
      >
        <div
          ref={containerRef}
          className="h-full ql-custom"
        />
        {!!image && (
          <div className="p-2">
            <div className="relative size-16 flex items-center justify-center group/image">
              <Hint
                label="Remove image"
                asChild
              >
                <button
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = "";
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                className="rounded-xl ;overflow-hidden border object-cover"
                src={URL.createObjectURL(image)}
                alt="uploaded"
                fill
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
            asChild
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
            >
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === "create" && (
            <Hint
              label="Image"
              asChild
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="text-white bg-slate-600 hover:bg-slate-600/80"
                variant="ghost"
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint
              label="Send"
              asChild
            >
              <Button
                className={cn(
                  "ml-auto",
                  isEmpty
                    ? "text-slate-600 bg-white hover:bg-white border rounded-md border-slate-600"
                    : "text-white bg-slate-600 hover:bg-slate-600/80",
                )}
                variant="ghost"
                size="iconSm"
                disabled={disabled || isEmpty}
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div>
          <p
            className={cn(
              "p-2 text-xs text-slate-600 flex gap-1 justify-end opacity-0 transition",
              !isEmpty && "opacity-100",
            )}
          >
            <strong>Shift + Return </strong> <span>to add a new line</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
