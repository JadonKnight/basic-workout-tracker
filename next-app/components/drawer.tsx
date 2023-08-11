"use client";

import { Drawer } from "vaul";
import { useState } from "react";

interface DrawerProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  onClose: () => void;
}

interface NonDissmisibleDrawerProps extends DrawerProps {
  closeText: string;
}

// NOTE: Currently if there are inputs inside the drawers
// and a mobile user (on android, haven't tested iOS) pulls their keyboard
// up, it shifts the layout up and then causes a big white gap when it shifts down
// essentially not scaling the Drawer.Content height correctly.

// I've solved this temporarily by just making the height 96% of the screen height,
// however, I think I'll need to add a resize listener and some dynamic scaling
// for a more robust solution - assuming I want/need one of course.

export function DismissibleDrawer({ trigger, content }: DrawerProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div
            className="p-4 bg-gradient-to-tl from-violet-500
                  to-blue-500 rounded-t-[10px] text-white flex-1"
          >
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto">{content}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function NonDissmissibleDrawer({ trigger, content, closeText, onClose }: NonDissmisibleDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root dismissible={false} open={open} shouldScaleBackground>
      <Drawer.Trigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
          <div
            className="p-4 bg-gradient-to-tl from-violet-500
                  to-blue-500 rounded-t-[10px] text-white flex-1"
          >
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto">{content}</div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
              className="w-full md:w-fit text-white bg-purple-500 font-bold py-2 px-4 rounded mt-4"
            >
              {closeText}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
