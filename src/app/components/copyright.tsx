"use client";

import { useEffect, useState } from "react";

export function Copyright() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <p>
        &copy; {year || new Date().getFullYear()} Eventide. All rights reserved.
      </p>
    </footer>
  );
}
