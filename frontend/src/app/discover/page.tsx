"use client";

import { useEffect, useState } from "react";
import { discoverUsers } from "@/lib/api";
import type { User } from "@/lib/types";
import { TopNavBar } from "@/components/TopNavBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { ProfileCard } from "@/components/ProfileCard";

const FILTER_INPUT_CLASS =
  "w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-body-md hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors";

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [q, setQ] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const hasActiveFilters = Boolean(skill || location || q);

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(() => {
      setIsFetching(true);
      discoverUsers({ skill: skill || undefined, location: location || undefined, q: q || undefined })
        .then((result) => {
          if (cancelled) return;
          setUsers(result);
        })
        .finally(() => {
          if (cancelled) return;
          setIsFetching(false);
          setInitialLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [skill, location, q]);

  function clearFilters() {
    setSkill("");
    setLocation("");
    setQ("");
  }

  return (
    <>
      <TopNavBar />
      <main className="flex-1 pt-16 md:pt-24 pb-20 md:pb-8 px-4 md:px-16 max-w-[1200px] w-full mx-auto flex flex-col gap-6">
        <header>
          <h1 className="text-headline-lg text-on-background mb-1">Discover collaborators</h1>
          <p className="text-body-md text-on-surface-variant">
            {initialLoading
              ? "Searching..."
              : `${users.length} ${users.length === 1 ? "profile" : "profiles"} found`}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:sticky md:top-24 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-md">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-label-sm text-primary hover:underline transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-label-md text-on-surface-variant mb-2">Search</h3>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or title..."
                  className={FILTER_INPUT_CLASS}
                />
              </div>
              <div>
                <h3 className="text-label-md text-on-surface-variant mb-2">Skill</h3>
                <input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Python"
                  className={FILTER_INPUT_CLASS}
                />
              </div>
              <div>
                <h3 className="text-label-md text-on-surface-variant mb-2">Location</h3>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote"
                  className={FILTER_INPUT_CLASS}
                />
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            {initialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 rounded-lg border border-outline-variant bg-surface-container-low animate-pulse"
                  />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 text-center">
                <p className="text-body-md text-on-surface-variant">No profiles match your filters yet.</p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch transition-opacity duration-150 ${
                  isFetching ? "opacity-50" : "opacity-100"
                }`}
              >
                {users.map((user) => (
                  <ProfileCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
