"use client";

import { useState } from "react";

export function ContactButton({ email }: { email: string }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <a
        href={`mailto:${email}`}
        className="w-full md:w-auto bg-primary text-on-primary rounded px-6 py-3 text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]!">mail</span>
        {email}
      </a>
    );
  }

  return (
    <button
      onClick={() => setRevealed(true)}
      className="w-full md:w-auto bg-primary text-on-primary rounded px-6 py-3 text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[20px]!">mail</span>
      Contact
    </button>
  );
}
