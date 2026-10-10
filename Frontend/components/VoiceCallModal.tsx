"use client";

import { API_BASE_URL } from "@/lib/api";

import React, { useState, useEffect, useRef } from "react";
import { startOutgoingRingtone, stopOutgoingRingtone } from "@/lib/utils";

interface VoiceCallModalProps {
  token: string | null;
  bookingId: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: "RINGING" | "CONNECTED" | "ENDED";
  existingCallId?: string;
}

export default function VoiceCallModal({
  token,
  bookingId,
  recipientName,
  isOpen,
  onClose,
  initialStatus = "RINGING",
  existingCallId,
}: VoiceCallModalProps) {
  const [callStatus, setCallStatus] = useState<
    "RINGING" | "CONNECTED" | "ENDED"
  >(initialStatus);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(
    existingCallId || null,
  );
  const [micActive, setMicActive] = useState(false);
  const [micNotice, setMicNotice] = useState<string>("");

  const pollTimerRef = useRef<any>(null);
  const ringTimeoutRef = useRef<any>(null);
  const peerConnRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const isCallerRef = useRef<boolean>(!existingCallId);

  // Sync isCallerRef
  useEffect(() => {
    isCallerRef.current = !existingCallId;
  }, [existingCallId]);

  // Handle Call Initiation & Outgoing Ringing Polling
  useEffect(() => {
    if (!isOpen) {
      stopOutgoingRingtone();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      return;
    }

    setCallStatus(initialStatus);
    setDuration(0);
    setStatusMessage("");

    const activeToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("bayflow_token")
        : null);

    if (initialStatus === "RINGING") {
      // 1. Play real outgoing ringback tone for caller
      startOutgoingRingtone();

      // 2. Initiate call on backend
      const startCall = async () => {
        let currentCallId = existingCallId || null;

        if (!currentCallId && activeToken && bookingId) {
          try {
            const res = await fetch(
              `${API_BASE_URL}/api/calls/initiate`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({ bookingId }),
              },
            );
            const data = await res.json();
            if (res.ok && data.success && data.data?.callId) {
              currentCallId = data.data.callId;
              setActiveCallId(currentCallId);
            }
          } catch (err) {
            console.warn("Failed to initiate call on backend:", err);
          }
        }

        // 3. Fast poll backend (every 400ms) to check if receiver answered
        const checkStatus = async () => {
          const targetId = currentCallId || activeCallId || bookingId;
          if (!targetId || !activeToken) return;

          try {
            const res = await fetch(
              `${API_BASE_URL}/api/calls/${targetId}`,
              {
                headers: { Authorization: `Bearer ${activeToken}` },
              },
            );
            const data = await res.json();
            const call = data.data;

            if (res.ok && call) {
              if (call.id && !currentCallId) {
                currentCallId = call.id;
                setActiveCallId(call.id);
              }

              if (call.status === "CONNECTED") {
                stopOutgoingRingtone();
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                if (ringTimeoutRef.current)
                  clearTimeout(ringTimeoutRef.current);
                if (call.id) setActiveCallId(call.id);
                setCallStatus("CONNECTED");
              } else if (call.status === "REJECTED") {
                stopOutgoingRingtone();
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                if (ringTimeoutRef.current)
                  clearTimeout(ringTimeoutRef.current);
                setCallStatus("ENDED");
                setStatusMessage("Call Declined by recipient");
                setTimeout(onClose, 1500);
              } else if (call.status === "ENDED") {
                stopOutgoingRingtone();
                if (pollTimerRef.current) clearInterval(pollTimerRef.current);
                if (ringTimeoutRef.current)
                  clearTimeout(ringTimeoutRef.current);
                setCallStatus("ENDED");
                setStatusMessage("Call Ended");
                setTimeout(onClose, 1200);
              }
            }
          } catch (err) {}
        };

        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = setInterval(checkStatus, 400);

        // 4. Timeout after 40 seconds if receiver doesn't answer (Missed Call)
        if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = setTimeout(async () => {
          stopOutgoingRingtone();
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setCallStatus("ENDED");
          setStatusMessage("No answer (Call Missed)");

          const targetId = currentCallId || activeCallId;
          if (targetId && activeToken) {
            try {
              await fetch(
                `${API_BASE_URL}/api/calls/${targetId}/status`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${activeToken}`,
                  },
                  body: JSON.stringify({ status: "MISSED" }),
                },
              );
            } catch (e) {}
          }

          setTimeout(onClose, 2000);
        }, 40000);
      };

      startCall();
    }

    return () => {
      stopOutgoingRingtone();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    };
  }, [isOpen, initialStatus, existingCallId, bookingId, token]);

  // WebRTC Audio Stream Engine & Remote Hangup Polling when CONNECTED
  useEffect(() => {
    let durationInterval: any;
    let signalingInterval: any;
    let remoteCheckInterval: any;

    if (callStatus === "CONNECTED") {
      // 1. Duration Counter
      durationInterval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      const targetId = activeCallId || existingCallId;
      const activeToken =
        token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("bayflow_token")
          : null);

      const role: "caller" | "receiver" = isCallerRef.current
        ? "caller"
        : "receiver";
      let lastSignalTime = 0;
      const handledSignalIds = new Set<string>();

      // 2. Initialize Real WebRTC Audio Peer Connection
      const setupWebRTC = async () => {
        if (
          typeof window === "undefined" ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          setMicNotice("WebRTC not supported in this environment");
          return;
        }

        try {
          // Request real microphone audio
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
            video: false,
          });

          localStreamRef.current = stream;
          setMicActive(true);
          setMicNotice("Live Voice Audio Active");

          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          });
          peerConnRef.current = pc;

          // Add microphone audio tracks to peer connection
          stream
            .getAudioTracks()
            .forEach((track) => pc.addTrack(track, stream));

          // Receive remote audio track from other person
          pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
              if (!remoteAudioRef.current) {
                const audio = new Audio();
                audio.srcObject = event.streams[0];
                audio.autoplay = true;
                remoteAudioRef.current = audio;
              } else {
                remoteAudioRef.current.srcObject = event.streams[0];
              }
              remoteAudioRef.current.play().catch(() => {});
            }
          };

          // Send ICE candidates to opposing party
          pc.onicecandidate = (event) => {
            if (event.candidate && targetId && activeToken) {
              fetch(`${API_BASE_URL}/api/calls/${targetId}/signal`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({
                  sender: role,
                  type: "candidate",
                  payload: event.candidate,
                }),
              }).catch(() => {});
            }
          };

          // If caller, initiate WebRTC Offer
          if (role === "caller") {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            if (targetId && activeToken) {
              await fetch(
                `${API_BASE_URL}/api/calls/${targetId}/signal`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${activeToken}`,
                  },
                  body: JSON.stringify({
                    sender: role,
                    type: "offer",
                    payload: offer,
                  }),
                },
              ).catch(() => {});
            }
          }

          // 3. Signaling Poller (every 400ms for instant voice exchange)
          signalingInterval = setInterval(async () => {
            if (!targetId || !activeToken || !peerConnRef.current) return;

            try {
              const res = await fetch(
                `${API_BASE_URL}/api/calls/${targetId}/signals?sender=${role}&after=${lastSignalTime}`,
                {
                  headers: { Authorization: `Bearer ${activeToken}` },
                },
              );
              const data = await res.json();
              const signals = data.data || [];

              for (const sig of signals) {
                if (handledSignalIds.has(sig.id)) continue;
                handledSignalIds.add(sig.id);
                lastSignalTime = Math.max(lastSignalTime, sig.timestamp);

                const peer = peerConnRef.current;
                if (!peer) continue;

                if (sig.type === "offer" && role === "receiver") {
                  await peer.setRemoteDescription(
                    new RTCSessionDescription(sig.payload),
                  );
                  const answer = await peer.createAnswer();
                  await peer.setLocalDescription(answer);

                  await fetch(
                    `${API_BASE_URL}/api/calls/${targetId}/signal`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${activeToken}`,
                      },
                      body: JSON.stringify({
                        sender: role,
                        type: "answer",
                        payload: answer,
                      }),
                    },
                  );
                } else if (sig.type === "answer" && role === "caller") {
                  if (peer.signalingState !== "stable") {
                    await peer.setRemoteDescription(
                      new RTCSessionDescription(sig.payload),
                    );
                  }
                } else if (sig.type === "candidate") {
                  try {
                    await peer.addIceCandidate(
                      new RTCIceCandidate(sig.payload),
                    );
                  } catch (e) {}
                }
              }
            } catch (err) {}
          }, 400);
        } catch (micErr: any) {
          console.warn("Could not capture local microphone:", micErr);
          setMicNotice("Microphone unavailable / permission denied");
        }
      };

      setupWebRTC();

      // 4. Remote participant termination poll (every 1000ms)
      if (targetId && activeToken) {
        remoteCheckInterval = setInterval(async () => {
          try {
            const res = await fetch(
              `${API_BASE_URL}/api/calls/${targetId}`,
              {
                headers: { Authorization: `Bearer ${activeToken}` },
              },
            );
            const data = await res.json();
            const call = data.data;
            if (res.ok && call) {
              if (call.status === "ENDED" || call.status === "REJECTED") {
                setCallStatus("ENDED");
                setStatusMessage("Call Ended by other party");
                setTimeout(onClose, 1000);
              }
            }
          } catch (e) {}
        }, 1000);
      }
    }

    return () => {
      if (durationInterval) clearInterval(durationInterval);
      if (signalingInterval) clearInterval(signalingInterval);
      if (remoteCheckInterval) clearInterval(remoteCheckInterval);

      // Clean up audio streams and WebRTC connections
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnRef.current) {
        peerConnRef.current.close();
        peerConnRef.current = null;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
        remoteAudioRef.current = null;
      }
    };
  }, [callStatus, activeCallId, existingCallId, token, onClose]);

  // Handle Mute/Unmute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const nextMuted = !isMuted;
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleEndCall = async () => {
    stopOutgoingRingtone();
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);

    // Stop microphone & WebRTC immediately
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnRef.current) {
      peerConnRef.current.close();
      peerConnRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }

    setCallStatus("ENDED");
    const activeToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("bayflow_token")
        : null);
    const targetCallId = activeCallId || existingCallId;

    if (activeToken && targetCallId) {
      try {
        await fetch(`${API_BASE_URL}/api/calls/${targetCallId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ status: "ENDED", duration }),
        });
      } catch (err) {
        console.warn("Call status log error:", err);
      }
    }
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/20 text-white rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-20 h-20 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20 shadow-lg relative">
            {callStatus === "RINGING" && (
              <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
            )}
            <span className="material-symbols-outlined text-4xl">
              phone_in_talk
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">
              BAYFLOW VOICE CONNECT
            </span>
            <h3 className="font-headline text-2xl font-extrabold text-white mt-1">
              {recipientName}
            </h3>
            <p className="text-xs text-white/70 font-mono mt-0.5">
              Ref: {bookingId}
            </p>
          </div>

          <div className="pt-2">
            {callStatus === "RINGING" && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                Ringing... Waiting for answer
              </span>
            )}

            {callStatus === "CONNECTED" && (
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F5C45] text-white text-xs font-mono font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected • {formatTime(duration)}
                </span>
                <p className="text-[11px] font-mono text-emerald-400/90 font-medium">
                  {micActive ? "🎙️ Live Microphone Voice Active" : micNotice}
                </p>
              </div>
            )}

            {callStatus === "ENDED" && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                {statusMessage || "Call Ended"}
              </span>
            )}
          </div>
        </div>

        {/* Call Action Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-6 pt-4">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted
                ? "bg-rose-500 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            <span className="material-symbols-outlined text-xl">
              {isMuted ? "mic_off" : "mic"}
            </span>
          </button>

          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer ring-4 ring-rose-600/30"
            title="End Call"
          >
            <span className="material-symbols-outlined text-2xl">call_end</span>
          </button>
        </div>
      </div>
    </div>
  );
}
