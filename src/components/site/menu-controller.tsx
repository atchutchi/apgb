"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function MenuController({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navigation = navigationRef.current;

    if (!navigation) {
      return;
    }

    const details = Array.from(navigation.querySelectorAll("details"));

    const closeMenus = (except?: HTMLDetailsElement) => {
      details.forEach((item) => {
        if (item !== except) {
          item.open = false;
        }
      });
    };

    const toggleHandlers = details.map((item) => {
      const handler = () => {
        if (item.open) {
          closeMenus(item);
        }
      };

      item.addEventListener("toggle", handler);
      return { handler, item };
    });

    const handlePointerDown = (event: PointerEvent) => {
      if (!navigation.contains(event.target as Node)) {
        closeMenus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const activeSummary = navigation.querySelector<HTMLElement>("details[open] > summary");
        closeMenus();
        activeSummary?.focus();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("a")) {
        closeMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    navigation.addEventListener("click", handleClick);

    return () => {
      toggleHandlers.forEach(({ handler, item }) => item.removeEventListener("toggle", handler));
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      navigation.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <nav ref={navigationRef} className={className} aria-label={label}>
      {children}
    </nav>
  );
}
