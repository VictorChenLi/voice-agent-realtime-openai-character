"use client";

import React, { useRef, useEffect, useState } from "react";
import { useEvent } from "@/app/contexts/EventContext";
import { LoggedEvent } from "@/app/types";

export interface EventsProps {
  isExpanded: boolean;
  onClose?: () => void;
}

function Events({ isExpanded, onClose }: EventsProps) {
  const [prevEventLogs, setPrevEventLogs] = useState<LoggedEvent[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const eventLogsContainerRef = useRef<HTMLDivElement | null>(null);

  const { loggedEvents, toggleExpand } = useEvent();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getDirectionArrow = (direction: string) => {
    if (direction === "client") return { symbol: "▲", color: "#7f5af0" };
    if (direction === "server") return { symbol: "▼", color: "#2cb67d" };
    return { symbol: "•", color: "#555" };
  };

  useEffect(() => {
    const hasNewEvent = loggedEvents.length > prevEventLogs.length;

    if (isExpanded && hasNewEvent && eventLogsContainerRef.current) {
      eventLogsContainerRef.current.scrollTop =
        eventLogsContainerRef.current.scrollHeight;
    }

    setPrevEventLogs(loggedEvents);
  }, [loggedEvents, isExpanded]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => onClose?.()}
        />
      )}

      {/* Events Panel */}
      <div
        className={
          // Desktop styles
          "md:transition-all md:rounded-xl md:duration-200 md:ease-in-out md:flex-col md:bg-white " +
          (isExpanded
            ? "md:w-1/2 md:overflow-auto md:opacity-100 "
            : "md:w-0 md:overflow-hidden md:opacity-0 ") +
          // Mobile styles - slide-out panel
          "fixed md:relative top-0 right-0 h-full md:h-auto z-50 md:z-auto " +
          "w-80 max-w-[85vw] md:max-w-none bg-white md:bg-transparent " +
          "transform transition-transform duration-300 ease-in-out " +
          (isExpanded
            ? "translate-x-0 "
            : "translate-x-full md:translate-x-0 ")
        }
        ref={eventLogsContainerRef}
      >
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-3.5 sticky top-0 z-10 text-base border-b bg-white rounded-t-xl">
              <span className="font-semibold">Logs</span>
              {/* Close button for mobile */}
              <button
                className="md:hidden p-1"
                onClick={() => onClose?.()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {loggedEvents.map((log, idx) => {
                const arrowInfo = getDirectionArrow(log.direction);
                const isError =
                  log.eventName.toLowerCase().includes("error") ||
                  log.eventData?.response?.status_details?.error != null;

                return (
                  <div
                    key={`${log.id}-${idx}`}
                    className="border-t border-gray-200 py-2 px-6 font-mono"
                  >
                    <div
                      onClick={() => toggleExpand(log.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center flex-1">
                        <span
                          style={{ color: arrowInfo.color }}
                          className="ml-1 mr-2"
                        >
                        {arrowInfo.symbol}
                        </span>
                        <span
                          className={
                            "flex-1 text-sm " +
                            (isError ? "text-red-600" : "text-gray-800")
                          }
                        >
                          {log.eventName}
                        </span>
                      </div>
                      <div className="text-gray-500 ml-1 text-xs whitespace-nowrap">
                        {log.timestamp}
                      </div>
                    </div>

                    {log.expanded && log.eventData && (
                      <div className="text-gray-800 text-left">
                        <pre className="border-l-2 ml-1 border-gray-200 whitespace-pre-wrap break-words font-mono text-xs mb-2 mt-2 pl-2">
                          {JSON.stringify(log.eventData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </>
  );
}

export default Events;
