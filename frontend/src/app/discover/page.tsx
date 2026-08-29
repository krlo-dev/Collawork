"use client";

import { useEffect, useState } from "react";
import { discoverUsers } from "@/lib/api";
import type { User } from "@/lib/types";
import { TopNavBar } from "@/components/TopNavBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { ProfileCard } from "@/components/ProfileCard";

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      discoverUsers({ skill: skill || undefined, location: location || undefined, q: q || undefined })
        .then(setUsers)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [skill, location, q]);

  return (
    <>
      <TopNavBar />
      <main className="flex-1 pt-16 md:pt-24 pb-20 md:pb-8 px-4 md:px-16 max-w-[1200px] w-full mx-auto flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:sticky md:top-24 flex flex-col gap-6">
            <div>
              <h2 className="text-headline-md mb-3">Filters</h2>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or title..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <h3 className="text-label-md text-on-surface-variant mb-2">Skill</h3>
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Python"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <h3 className="text-label-md text-on-surface-variant mb-2">Location</h3>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-body-md text-on-surface-variant">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">No profiles match your filters yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <ProfileCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
