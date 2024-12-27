"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function TanStackDevTools() {
  return <ReactQueryDevtools initialIsOpen={false} />;
}
