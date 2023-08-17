import { cn } from "@/lib/utils";

interface LoaderProps {
  children: React.ReactNode;
  active: boolean;
}

export default function Loader({ children, active }: LoaderProps) {
  return active ? (
    <div
      className={`${
        active ? "flex" : "hidden"
      } items-center justify-center fixed inset-0`}
    >
      <div
        className="inline-block text-violet-300 h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}

// TODO: Start re-writing these as much more flexible components
// alright for now.
export function InlineLoader({ children, active }: LoaderProps) {
  return active ? (
    <div
      className={cn(
        active ? "flex" : "hidden",
        "items-center justify-center m-3"
      )}
    >
      <div
        className="inline-block text-white h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}
