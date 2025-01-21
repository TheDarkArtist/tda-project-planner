/* eslint-disable @next/next/no-img-element */

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
          <img
            className="rounded-md object-cover size-full"
            src={url}
            alt="Message image"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg border-none bg-transparent p-0 shadow-none backdrop-blur">
        <DialogTitle hidden>Image preview</DialogTitle>
        <div className="relative aspect-video overflow-hidden max-w-screen-lg border border-slate-600 rounded-lg my-2 cursor-zoom-in">
          <img
            className="rounded-md object-cover size-full"
            src={url}
            alt="Message image"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
