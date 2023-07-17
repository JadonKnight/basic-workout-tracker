import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

interface AlertModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  onCancel: () => void;
  active: boolean;
  type?: AlertType;
}

type AlertType = "question" | "warning";

export default function MyModal({
  title,
  description,
  onConfirm,
  confirmText,
  onCancel,
  active,
  type,
}: AlertModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    onCancel();
  }

  // function openModal() {
  //   setIsOpen(true);
  // }

  useEffect(() => {
    setIsOpen(active);
  }, [active]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-center">
                  {type && type === "question" ? (
                    <QuestionMarkCircleIcon className="mb-3 h-12 w-12 text-blue-500" />
                  ) : (
                    <ExclamationTriangleIcon className="mb-3 h-12 w-12 text-yellow-500" />
                  )}
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-center text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-center text-sm text-gray-500">
                    {description}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={
                      type && type === "question"
                        ? "inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        : "inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    }
                    onClick={() => {
                      onConfirm();
                      closeModal();
                    }}
                  >
                    {confirmText ? confirmText : "Confirm"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
