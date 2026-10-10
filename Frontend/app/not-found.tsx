import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#2C2421] font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-8 sm:p-12 max-w-md w-full space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center mx-auto font-bold text-xl">
          404
        </div>
        <h1 className="font-headline text-2xl font-extrabold text-[#111827]">Page Not Found</h1>
        <p className="text-xs text-[#2C2421]/70">
          The page or route you are looking for does not exist in the BayFlow workspace.
        </p>
        <Link
          href="/dashboard"
          className="inline-block w-full py-3 bg-[#111827] text-white text-xs font-bold rounded-full hover:bg-[#0F172A] transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
