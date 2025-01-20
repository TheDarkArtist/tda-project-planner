import Image from "next/image";
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative aspect-video overflow-hidden max-w-sm border rounded-lg my-2 cursor-zoom-in">
          <Image
            className="rounded-md object-cover size-full"
            src={url}
            alt="Message image"
            fill
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md border-none bg-transparent p-0 shadow-none">
        <DialogTitle hidden>Image preview</DialogTitle>
        <div className="relative aspect-video overflow-hidden max-w-screen-md border rounded-lg my-2 cursor-zoom-in">
          <Image
            className="rounded-md object-cover size-full"
            src={url}
            alt="Message image"
            fill
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
