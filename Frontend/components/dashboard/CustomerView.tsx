"use client";

import { API_BASE_URL } from "@/lib/api";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import VoiceCallModal from "@/components/VoiceCallModal";

interface CustomerViewProps {
  token: string | null;
  userId?: string;
  email?: string;
}

export default function CustomerView({ token, userId, email }: CustomerViewProps) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Audit History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Vehicle History Modal State
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([]);
  const [searchPlate, setSearchPlate] = useState("LEA-1234");
  const [loadingVehicleHistory, setLoadingVehicleHistory] = useState(false);

  // Voice Call Modal State
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedBookingForCall, setSelectedBookingForCall] = useState<any | null>(null);

  useEffect(() => {
    fetchCustomerBookings();
  }, [token]);

  const fetchCustomerBookings = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.data || data.bookings;
      if (res.ok && data.success && Array.isArray(list)) {
        setBookings(list);
      } else {
        setErrorMsg(data.error || data.message || "No active bookings found for your account.");
      }
    } catch (err: any) {
      console.error("Backend error fetching customer bookings:", err);
      setErrorMsg("Failed to connect to BayFlow backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async (bookingId: string) => {
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.data || data.history;
      if (res.ok && data.success && Array.isArray(list)) {
        setHistoryLogs(list);
      } else {
        setHistoryLogs([]);
      }
    } catch (err) {
      setHistoryLogs([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchVehicleHistory = async (plateNumber: string) => {
    setSearchPlate(plateNumber);
    setShowVehicleModal(true);
    setLoadingVehicleHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/vehicle/${plateNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = data.data || data.bookings;
      if (res.ok && data.success && Array.isArray(list)) {
        setVehicleHistory(list);
      } else {
        setVehicleHistory([]);
      }
    } catch (err) {
      setVehicleHistory([]);
    } finally {
      setLoadingVehicleHistory(false);
    }
  };

  const handleRespondEstimate = async (bookingId: string, action: "APPROVE" | "REJECT") => {
    setActionSuccess("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/estimate/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action === "APPROVE" ? "APPROVED" : "REJECTED", action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(
          action === "APPROVE"
            ? "Estimate approved successfully! Workshop notified to begin repair."
            : "Estimate rejected. Service Advisor notified to revise quote."
        );
        fetchCustomerBookings();
      } else {
        setErrorMsg(data.error || data.message || "Failed to submit estimate response.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Server connection error.");
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    setActionSuccess("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "COMPLETED",
          notes: "Vehicle collected by customer",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess("Vehicle pickup confirmed! Thank you for using BayFlow.");
        fetchCustomerBookings();
      } else {
        setErrorMsg(data.error || data.message || "Failed to complete booking.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Server connection error.");
    }
  };

  const LIFECYCLE_STEPS = [
    { step: 1, status: "PENDING", title: "Intake Review", role: "Service Advisor" },
    { step: 2, status: "CONFIRMED", title: "Confirmed", role: "Service Advisor" },
    { step: 3, status: "ASSIGNED", title: "Tech Assigned", role: "Technician" },
    { step: 4, status: "INSPECTING", title: "Inspection", role: "Technician" },
    { step: 5, status: "ESTIMATE_REVIEW", title: "Estimate Review", role: "Service Advisor" },
    { step: 6, status: "AWAITING_CUSTOMER", title: "Customer Approval", role: "Customer" },
    { step: 7, status: "ESTIMATE_APPROVED", title: "Estimate Approved", role: "Service Advisor" },
    { step: 8, status: "PARTS_PENDING", title: "Parts Sourcing", role: "Parts Person" },
    { step: 9, status: "PARTS_ORDERED", title: "Parts Ordered", role: "Parts Person" },
    { step: 10, status: "PARTS_READY", title: "Parts Allocated", role: "Parts Person" },
    { step: 11, status: "IN_REPAIR", title: "Active Repair", role: "Technician" },
    { step: 12, status: "QC_PENDING", title: "QC Queue", role: "QC Inspector" },
    { step: 13, status: "QC_IN_PROGRESS", title: "QC Road Test", role: "QC Inspector" },
    { step: 14, status: "READY_FOR_PICKUP", title: "Ready for Pickup", role: "Service Advisor" },
    { step: 15, status: "COMPLETED", title: "Completed & Closed", role: "Customer" },
  ];

  const calculateSteps = (currentStatus: string) => {
    const statusOrder = LIFECYCLE_STEPS.map((s) => s.status);
    const currentIndex = statusOrder.indexOf(currentStatus);

    return LIFECYCLE_STEPS.map((s, idx) => ({
      ...s,
      done: currentIndex > idx || currentStatus === "COMPLETED",
      active: s.status === currentStatus,
      isPending: currentIndex < idx && currentStatus !== "COMPLETED",
    }));
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-xs font-bold text-[#2C2421]">
        <span className="animate-spin material-symbols-outlined text-2xl mb-2 text-[#111827]">progress_activity</span>
        <span>Loading live customer portal data from backend...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Profile Header */}
      <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F5C45]/10 text-[#1F5C45] text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-sm">directions_car</span>
            <span>CUSTOMER PORTAL</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421]">
            Vehicle Service Control
          </h1>
          <p className="text-xs sm:text-sm text-[#2C2421]/70 mt-1">
            Account: <strong className="text-[#2C2421]">{email}</strong>
          </p>
        </div>

        <Link
          href="/shops"
          className="px-5 py-3 bg-[#111827] hover:bg-[#0F172A] text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Book New Service Appointment</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-[#1F5C45]/15 border border-[#1F5C45]/30 rounded-2xl text-xs font-bold text-[#1F5C45] flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{actionSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#E85D22]/15 border border-[#E85D22]/30 rounded-2xl text-xs font-bold text-[#E85D22] flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-12 text-center text-xs font-bold text-[#2C2421]/60 space-y-4">
          <p>No active vehicle service bookings found for your account.</p>
          <Link
            href="/shops"
            className="inline-block px-5 py-2.5 bg-[#111827] text-white rounded-full text-xs font-bold"
          >
            Find a Shop &amp; Book Now
          </Link>
        </div>
      ) : (
        bookings.map((booking) => {
          const steps = calculateSteps(booking.status);
          const vehiclePlate = booking.vehicleDetails?.plate || "LEA-1234";

          return (
            <div key={booking.id} className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2C2421]/10 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#111827] bg-[#F4F4F1] px-2 py-0.5 rounded">
                      Ref: {booking.id}
                    </span>
                    <button
                      onClick={() => fetchBookingHistory(booking.id)}
                      className="text-[11px] font-bold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">history</span>
                      <span>Audit Trail</span>
                    </button>
                  </div>
                  <h2 className="font-headline text-xl font-bold text-[#2C2421] mt-1.5">
                    {booking.shop?.name || "Workshop Branch"}
                  </h2>
                  <p className="text-xs text-[#2C2421]/60">
                    {booking.shop?.address || "Main Branch"} • {booking.shop?.phone || "Phone N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedBookingForCall(booking);
                      setShowCallModal(true);
                    }}
                    className="px-3.5 py-2 bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    <span>Call Shop</span>
                  </button>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      booking.status === "ESTIMATE_APPROVED"
                        ? "bg-[#1F5C45] text-white"
                        : booking.status === "ESTIMATE_REJECTED"
                        ? "bg-[#E85D22] text-white"
                        : "bg-[#111827] text-white"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Vehicle & Reported Issues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8F8F5] p-4 rounded-2xl border border-[#2C2421]/10">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#2C2421]/60 font-medium">Vehicle Details:</span>
                    <button
                      onClick={() => fetchVehicleHistory(vehiclePlate)}
                      className="text-[10px] font-bold text-[#111827] hover:underline cursor-pointer"
                    >
                      Service History
                    </button>
                  </div>
                  <span className="font-bold text-[#2C2421] block">
                    {booking.vehicleDetails?.make} {booking.vehicleDetails?.model} ({booking.vehicleDetails?.year}) • Plate: {vehiclePlate}
                  </span>
                </div>
                <div>
                  <span className="text-[#2C2421]/60 block font-medium mb-0.5">Reported Symptoms:</span>
                  <span className="font-bold text-[#2C2421] block">
                    {Array.isArray(booking.issuesReported) ? booking.issuesReported.join(", ") : booking.issuesReported || "General Maintenance"}
                  </span>
                </div>
              </div>

              {/* 15-Step Booking Lifecycle Stepper */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2421]/70">
                    15-Step Booking Lifecycle Timeline
                  </h3>
                  {(() => {
                    const currentStepObj = steps.find((s) => s.active) || steps[0];
                    return (
                      <span className="text-[11px] font-bold text-[#1F5C45] bg-[#1F5C45]/10 px-2.5 py-0.5 rounded-full">
                        Active: Step {currentStepObj.step} ({currentStepObj.title})
                      </span>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {steps.map((s) => (
                    <div
                      key={s.step}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        s.done
                          ? "bg-[#1F5C45]/10 border-[#1F5C45] text-[#1F5C45]"
                          : s.active
                          ? "bg-[#111827] border-[#111827] text-white shadow-xs scale-[1.02]"
                          : "bg-[#F4F4F1] border-[#2C2421]/15 text-[#2C2421]/50"
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1">
                        {s.done && <span className="material-symbols-outlined text-xs">check_circle</span>}
                        {s.active && <span className="material-symbols-outlined text-xs text-amber-400">play_circle</span>}
                        <span>Step {s.step}</span>
                      </div>
                      <div className="text-xs font-bold mt-0.5 leading-tight">{s.title}</div>
                      <div className="text-[9px] opacity-75 mt-0.5">{s.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* READY FOR PICKUP ALERT */}
              {booking.status === "READY_FOR_PICKUP" && (
                <div className="p-5 bg-[#1F5C45] text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl">directions_car</span>
                    <div>
                      <h4 className="font-bold text-sm">Your Vehicle is Ready for Pickup!</h4>
                      <p className="text-xs text-white/80">Quality control road test passed. Please visit the shop to collect your vehicle.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteBooking(booking.id)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1F5C45] font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    <span>Confirm Vehicle Picked Up</span>
                  </button>
                </div>
              )}

              {/* ESTIMATE REVIEW & ITEMIZATION */}
              {booking.estimate && (
                <div className="bg-[#F4F4F1]/70 rounded-2xl border border-[#2C2421]/15 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#2C2421] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#111827]">receipt_long</span>
                      <span>Itemized Technician Estimate</span>
                    </h3>
                    <span className="text-xs text-[#2C2421]/60 font-medium">Submitted by Service Advisor</span>
                  </div>

                  <div className="divide-y divide-[#2C2421]/10 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span>Labour &amp; OBD Scan Diagnostics</span>
                      <span className="font-bold text-[#111827]">PKR {booking.estimate.labourCost?.toLocaleString()}</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span>Required Parts &amp; Replacements</span>
                      <span className="font-bold text-[#111827]">PKR {booking.estimate.partsCost?.toLocaleString()}</span>
                    </div>
                    <div className="pt-3 flex items-center justify-between font-extrabold text-sm text-[#2C2421]">
                      <span>Total Estimated Cost:</span>
                      <span className="text-base text-[#111827]">PKR {booking.estimate.totalCost?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Customer Approval Controls */}
                  {booking.status === "AWAITING_CUSTOMER" && (
                    <div className="pt-3 border-t border-[#2C2421]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-[#2C2421]/70 font-medium">
                        Please review the breakdown above and accept to authorize repair start.
                      </p>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleRespondEstimate(booking.id, "REJECT")}
                          className="w-full sm:w-auto px-4 py-2.5 border border-[#E85D22] text-[#E85D22] hover:bg-[#E85D22]/10 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Reject Estimate
                        </button>
                        <button
                          onClick={() => handleRespondEstimate(booking.id, "APPROVE")}
                          className="w-full sm:w-auto px-6 py-2.5 bg-[#1F5C45] hover:bg-[#164433] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Approve Estimate (PKR {booking.estimate.totalCost?.toLocaleString()})
                        </button>
                      </div>
                    </div>
                  )}

                  {booking.status === "ESTIMATE_APPROVED" && (
                    <div className="p-3 bg-[#1F5C45]/15 border border-[#1F5C45]/30 rounded-xl text-xs font-bold text-[#1F5C45] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Estimate authorized by customer. Parts allocation and repair work in progress.</span>
                    </div>
                  )}

                  {booking.status === "ESTIMATE_REJECTED" && (
                    <div className="p-3 bg-[#E85D22]/15 border border-[#E85D22]/30 rounded-xl text-xs font-bold text-[#E85D22] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">info</span>
                      <span>Estimate rejected. Service Advisor notified to revise quote or cancel booking.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* AUDIT HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#2C2421]/20 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-3">
              <h3 className="font-headline text-lg font-bold text-[#2C2421]">Booking Audit Log History</h3>
              <button onClick={() => setShowHistoryModal(false)} className="font-bold text-sm text-[#2C2421]/50 cursor-pointer">
                ✕
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-8 text-center text-xs font-bold text-[#2C2421]/60">Fetching audit logs from backend...</div>
            ) : historyLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#2C2421]/60">No history entries logged yet.</div>
            ) : (
              <div className="divide-y divide-[#2C2421]/10 text-xs max-h-72 overflow-y-auto">
                {historyLogs.map((log: any, idx: number) => (
                  <div key={idx} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#111827]">
                        {log.fromStatus} → {log.toStatus}
                      </span>
                      <span className="text-[10px] text-[#2C2421]/50 font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                    <p className="text-[#2C2421]/70">{log.notes || "Status updated"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VEHICLE HISTORY MODAL */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#2C2421]/20 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-3">
              <h3 className="font-headline text-lg font-bold text-[#2C2421]">Vehicle Repair History</h3>
              <button onClick={() => setShowVehicleModal(false)} className="font-bold text-sm text-[#2C2421]/50 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 text-xs font-bold text-[#2C2421]">
              Vehicle Plate: {searchPlate}
            </div>

            {loadingVehicleHistory ? (
              <div className="py-8 text-center text-xs font-bold text-[#2C2421]/60">Fetching vehicle history...</div>
            ) : vehicleHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#2C2421]/60">No prior repair history found for this vehicle.</div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto text-xs">
                {vehicleHistory.map((vh: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 space-y-1">
                    <div className="flex justify-between font-bold text-[#111827]">
                      <span>{vh.shop?.name || "Shop Branch"}</span>
                      <span>Status: {vh.status}</span>
                    </div>
                    <p className="text-[#2C2421]/70">
                      Issues: {Array.isArray(vh.issuesReported) ? vh.issuesReported.join(", ") : vh.issuesReported}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VOICE CALL MODAL */}
      <VoiceCallModal
        token={token}
        bookingId={selectedBookingForCall?.id || "BK-9021"}
        recipientName={selectedBookingForCall?.shop?.name || "Service Advisor"}
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
      />
    </div>
  );
}
