"use client";

import { API_BASE_URL } from "@/lib/api";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface OwnerViewProps {
  token: string | null;
  userId?: string;
  email?: string;
}

export default function OwnerView({ token, userId, email }: OwnerViewProps) {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "team" | "services" | "analytics">("overview");

  // Add Shop Modal State
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [newShopForm, setNewShopForm] = useState({ name: "", city: "Lahore", address: "", phone: "" });
  const [shopError, setShopError] = useState("");

  // Add Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({ email: "", password: "", role: "SERVICE_ADVISOR", phoneNumber: "" });
  const [staffError, setStaffError] = useState("");
  const [staffSuccess, setStaffSuccess] = useState("");

  // Add Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: "", durationMinutes: 60, basePrice: 4000 });
  const [serviceError, setServiceError] = useState("");

  useEffect(() => {
    fetchShops();
  }, [token]);

  useEffect(() => {
    if (selectedShopId) {
      fetchBookings(selectedShopId);
      fetchTeam(selectedShopId);
      fetchServices(selectedShopId);
      fetchAnalytics(selectedShopId);
    }
  }, [selectedShopId]);

  const fetchShops = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/shops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const shopList = data.data || data.shops;
      if (res.ok && data.success && Array.isArray(shopList)) {
        // Decode user token to extract shopId if available
        let userShopId = "";
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userShopId = payload.shopId || "";
        } catch (e) {}

        const ownerShops = shopList.filter((s: any) =>
          (userId && (s.ownerId === userId || s.users?.some((u: any) => u.id === userId))) ||
          (userShopId && s.id === userShopId) ||
          (email && s.users?.some((u: any) => u.email?.toLowerCase() === email.toLowerCase()))
        );
        const finalShops = ownerShops.length > 0 ? ownerShops : shopList;
        setShops(finalShops);
        if (finalShops.length > 0) {
          setSelectedShopId((prev) => (prev && finalShops.some((s: any) => s.id === prev) ? prev : finalShops[0].id));
        }
      }
    } catch (err) {
      console.error("Failed to fetch owner shops:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async (shopId: string) => {
    if (!token || !shopId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/shops/${shopId}/team`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Shop-Id": shopId,
        },
      });
      const data = await res.json();
      const teamList = data.data || data.team;
      if (res.ok && data.success && Array.isArray(teamList)) {
        setTeamMembers(teamList);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      setTeamMembers([]);
    }
  };

  const fetchServices = async (shopId: string) => {
    if (!shopId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/shops/${shopId}/services`);
      const data = await res.json();
      const servicesList = data.data || data.services;
      if (res.ok && data.success && Array.isArray(servicesList)) {
        setServices(servicesList);
      } else {
        setServices([]);
      }
    } catch (err) {
      setServices([]);
    }
  };

  const fetchAnalytics = async (shopId: string) => {
    if (!token || !shopId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/shops/${shopId}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Shop-Id": shopId,
        },
      });
      const data = await res.json();
      const analyticsData = data.data || data.analytics;
      if (res.ok && data.success) {
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.warn("Analytics fetch error:", err);
    }
  };

  const fetchBookings = async (shopId: string) => {
    if (!token || !shopId) return;
    setLoadingBookings(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings?shopId=${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Shop-Id": shopId,
        },
      });
      const data = await res.json();
      const list = data.data || data.bookings;
      if (res.ok && data.success && Array.isArray(list)) {
        setBookings(list);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn("Bookings fetch error:", err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setShopError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newShopForm.name,
          city: newShopForm.city,
          address: newShopForm.address,
          phone: newShopForm.phone,
          phoneNumber: newShopForm.phone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddShopModal(false);
        const created = data.data || data.shop;
        setNewShopForm({ name: "", city: "Lahore", address: "", phone: "" });
        await fetchShops();
        if (created?.id) {
          setSelectedShopId(created.id);
        }
      } else {
        setShopError(data.error || data.message || "Failed to create shop branch.");
      }
    } catch (err: any) {
      setShopError(err.message || "Server connection error.");
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    setStaffSuccess("");

    if (!selectedShopId) {
      setStaffError("Please select an active shop branch first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/shops/${selectedShopId}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Shop-Id": selectedShopId,
        },
        body: JSON.stringify(staffForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStaffSuccess(`Staff member created successfully! (${staffForm.email})`);
        setShowAddStaffModal(false);
        setStaffForm({ email: "", password: "", role: "SERVICE_ADVISOR", phoneNumber: "" });
        fetchTeam(selectedShopId);
      } else {
        setStaffError(data.error || data.message || "Failed to add staff member.");
      }
    } catch (err: any) {
      setStaffError(err.message || "Server connection error.");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError("");
    if (!selectedShopId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/shops/${selectedShopId}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Shop-Id": selectedShopId,
        },
        body: JSON.stringify(serviceForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddServiceModal(false);
        setServiceForm({ name: "", durationMinutes: 60, basePrice: 4000 });
        fetchServices(selectedShopId);
      } else {
        setServiceError(data.error || data.message || "Failed to add service item.");
      }
    } catch (err: any) {
      setServiceError(err.message || "Server error.");
    }
  };

  const activeShop = shops.find((s) => s.id === selectedShopId) || shops[0];

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-xs font-bold text-[#2C2421]">
        <span className="animate-spin material-symbols-outlined text-2xl mb-2 text-[#111827]">progress_activity</span>
        <span>Loading owner multi-shop control center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Owner Header */}
      <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111827] text-white text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>OWNER CONTROL CENTER</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#2C2421]">
            Multi-Shop Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#2C2421]/70 mt-1">
            Logged in Owner: <strong className="text-[#2C2421]">{email}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* WhatsApp Link Route */}
          <Link
            href="/whatsapp"
            className="px-3.5 py-2 rounded-xl bg-[#1F5C45] hover:bg-[#164433] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Link WhatsApp Gateway</span>
          </Link>

          {/* Shop Switcher */}
          {shops.length > 0 && (
            <div className="flex items-center gap-2 bg-[#F8F8F5] p-2 rounded-xl border border-[#2C2421]/15">
              <span className="material-symbols-outlined text-base text-[#2C2421]/70 pl-1">store</span>
              <select
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#2C2421] focus:outline-none cursor-pointer pr-4"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city || "Branch"})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setShowAddShopModal(true)}
            className="px-3.5 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">add_business</span>
            <span>Add Branch</span>
          </button>
        </div>
      </div>

      {shops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-12 text-center text-xs font-bold text-[#2C2421]/60 space-y-4">
          <p>No shop branches created under your owner account yet.</p>
          <button
            onClick={() => setShowAddShopModal(true)}
            className="px-5 py-2.5 bg-[#111827] text-white rounded-full text-xs font-bold"
          >
            Create Your First Garage Branch
          </button>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-xs">
              <div className="text-xs font-bold text-[#2C2421]/60 uppercase tracking-wider">Active Shop</div>
              <div className="font-headline text-lg font-extrabold text-[#2C2421] mt-1 truncate">{activeShop?.name}</div>
              <div className="text-[11px] font-semibold text-[#1F5C45] mt-1">{activeShop?.address || activeShop?.city || "Branch Location"}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-xs">
              <div className="text-xs font-bold text-[#2C2421]/60 uppercase tracking-wider">Team Roster</div>
              <div className="font-headline text-2xl font-extrabold text-[#2C2421] mt-1">{teamMembers.length} Members</div>
              <div className="text-[11px] text-[#2C2421]/60 mt-1">SA, Techs, Parts, QC</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-xs">
              <div className="text-xs font-bold text-[#2C2421]/60 uppercase tracking-wider">Configured Services</div>
              <div className="font-headline text-2xl font-extrabold text-[#111827] mt-1">{services.length} Items</div>
              <div className="text-[11px] text-[#2C2421]/60 mt-1">Catalog pricing</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#2C2421]/15 shadow-xs">
              <div className="text-xs font-bold text-[#2C2421]/60 uppercase tracking-wider">Live Repairs / Bookings</div>
              <div className="font-headline text-2xl font-extrabold text-[#E85D22] mt-1">{bookings.length} Orders</div>
              <div className="text-[11px] text-[#2C2421]/60 mt-1">Customer appointments</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-[#2C2421]/15 overflow-x-auto">
            {(["overview", "bookings", "team", "services", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#111827] text-white shadow-xs"
                    : "text-[#2C2421]/70 hover:text-[#2C2421]"
                }`}
              >
                {tab === "bookings" ? "Live Repairs & Bookings" : tab}
              </button>
            ))}
          </div>

          {staffSuccess && (
            <div className="p-3.5 bg-[#1F5C45]/15 border border-[#1F5C45]/30 rounded-2xl text-xs font-bold text-[#1F5C45] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{staffSuccess}</span>
            </div>
          )}

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs space-y-4">
              <h3 className="font-headline text-lg font-bold text-[#2C2421]">Branch Operation Details</h3>
              <p className="text-xs text-[#2C2421]/70 leading-relaxed">
                Managing <strong>{activeShop?.name}</strong>. Every team member, inventory item, and booking query is strictly isolated to this shop location.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 space-y-2">
                  <div className="text-xs font-bold text-[#2C2421] flex items-center justify-between">
                    <span>Working Hours Config</span>
                    <span className="text-[10px] bg-[#1F5C45]/10 text-[#1F5C45] px-2 py-0.5 rounded font-mono">ACTIVE</span>
                  </div>
                  <p className="text-xs text-[#2C2421]/60">09:00 AM - 07:00 PM • Slot Duration: 60 mins</p>
                </div>

                <div className="p-4 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 space-y-2">
                  <div className="text-xs font-bold text-[#2C2421] flex items-center justify-between">
                    <span>Tenant ID Scoping</span>
                    <span className="text-[10px] bg-[#111827] text-white px-2 py-0.5 rounded font-mono">{activeShop?.id}</span>
                  </div>
                  <p className="text-xs text-[#2C2421]/60">Database queries strictly scoped server-side.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Live Repairs & Bookings */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2C2421]">
                    Live Repairs &amp; Bookings ({bookings.length})
                  </h3>
                  <p className="text-xs text-[#2C2421]/60">
                    Real-time vehicle repair lifecycle for <strong>{activeShop?.name}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectedShopId && fetchBookings(selectedShopId)}
                    disabled={loadingBookings}
                    className="px-3.5 py-2 border border-[#2C2421]/15 text-xs font-bold rounded-xl hover:bg-[#F8F8F5] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-base ${loadingBookings ? "animate-spin" : ""}`}>
                      refresh
                    </span>
                    <span>Refresh</span>
                  </button>
                  <div className="px-3.5 py-2 bg-[#F8F8F5] border border-[#2C2421]/15 text-[#2C2421] text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#111827]">visibility</span>
                    <span>Executive Oversight Mode</span>
                  </div>
                </div>
              </div>

              {loadingBookings ? (
                <div className="py-12 text-center text-xs font-bold text-[#2C2421]/60">
                  <span className="material-symbols-outlined animate-spin text-2xl mb-2">progress_activity</span>
                  <p>Loading shop repair orders...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#2C2421]/60 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F8F8F5] flex items-center justify-center mx-auto text-[#2C2421]/40">
                    <span className="material-symbols-outlined text-2xl">car_repair</span>
                  </div>
                  <p className="font-bold text-[#2C2421]">No Customer Appointments Yet</p>
                  <p className="max-w-md mx-auto text-[11px] leading-relaxed">
                    When customers choose <strong>{activeShop?.name}</strong> on the booking portal (<Link href="/shops" className="underline font-bold text-[#111827]">/shops</Link>), their appointment and vehicle details will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#2C2421]/10">
                  {bookings.map((booking: any) => {
                    const vehicle = booking.vehicleDetails || {};
                    const customer = booking.customer || {};
                    const tech = booking.technician;
                    const dateFormatted = new Date(booking.slotTime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    // Badge color matching 15-state machine
                    const statusColorMap: Record<string, string> = {
                      PENDING: "bg-amber-100 text-amber-800 border-amber-300",
                      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
                      ASSIGNED: "bg-indigo-100 text-indigo-800 border-indigo-300",
                      INSPECTING: "bg-purple-100 text-purple-800 border-purple-300",
                      ESTIMATE_REVIEW: "bg-yellow-100 text-yellow-800 border-yellow-300",
                      AWAITING_CUSTOMER: "bg-amber-100 text-amber-800 border-amber-300",
                      ESTIMATE_APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      ESTIMATE_REJECTED: "bg-red-100 text-red-800 border-red-300",
                      PARTS_PENDING: "bg-orange-100 text-orange-800 border-orange-300",
                      PARTS_READY: "bg-teal-100 text-teal-800 border-teal-300",
                      IN_REPAIR: "bg-cyan-100 text-cyan-800 border-cyan-300",
                      QC_PENDING: "bg-purple-100 text-purple-800 border-purple-300",
                      QC_IN_PROGRESS: "bg-purple-100 text-purple-800 border-purple-300",
                      READY_FOR_PICKUP: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      COMPLETED: "bg-gray-100 text-gray-800 border-gray-300",
                      CANCELLED: "bg-rose-100 text-rose-800 border-rose-300",
                    };
                    const badgeClass = statusColorMap[booking.status] || "bg-gray-100 text-gray-700 border-gray-200";

                    return (
                      <div key={booking.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-[#111827]">
                              #{booking.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeClass}`}>
                              {booking.status}
                            </span>
                            <span className="text-[11px] text-[#2C2421]/60 font-medium">
                              📅 {dateFormatted}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#2C2421]">
                            <span className="material-symbols-outlined text-sm text-[#111827]">directions_car</span>
                            <span>{vehicle.year || ""} {vehicle.make || "Vehicle"} {vehicle.model || ""}</span>
                            {vehicle.plate && (
                              <span className="px-2 py-0.5 bg-[#F8F8F5] border border-[#2C2421]/15 rounded font-mono text-[11px]">
                                {vehicle.plate}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-[#2C2421]/70 flex flex-wrap gap-4">
                            <span>👤 {customer.email || "Customer"} {customer.phoneNumber ? `(${customer.phoneNumber})` : ""}</span>
                            <span>🔧 Service: {booking.service?.name || (booking.issuesReported?.[0] || "General Inspection")}</span>
                            <span>👨‍🔧 Tech: {tech ? (tech.email || "Assigned") : <strong className="text-amber-600">Unassigned</strong>}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-right">
                          <div className="px-3 py-1 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 text-xs">
                            <span className="text-[#2C2421]/60 text-[10px] block font-mono">ESTIMATE REVENUE</span>
                            <span className="font-extrabold text-[#111827]">
                              PKR {(booking.estimateTotal || booking.service?.basePrice || 0).toLocaleString()}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 bg-[#111827]/5 text-[#111827] text-[10px] font-bold rounded-lg border border-[#111827]/10">
                            SA Managed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Team Roster */}
          {activeTab === "team" && (
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2C2421]">Shop Staff Roster</h3>
                  <p className="text-xs text-[#2C2421]/60">Manage staff accounts for {activeShop?.name}</p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>Add Staff Member</span>
                </button>
              </div>

              {teamMembers.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-[#2C2421]/60">
                  No staff accounts created for this shop yet. Click &quot;Add Staff Member&quot; to add team members.
                </div>
              ) : (
                <div className="divide-y divide-[#2C2421]/10 text-xs">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#2C2421] text-sm">{member.email}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#111827]/10 text-[#111827] ml-2">
                          {member.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#1F5C45] bg-[#1F5C45]/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Service Catalog */}
          {activeTab === "services" && (
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C2421]/10 pb-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#2C2421]">Service Catalog Editor</h3>
                  <p className="text-xs text-[#2C2421]/60">Manage pricing and service duration for {activeShop?.name}</p>
                </div>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-[#0F172A] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add Service Item</span>
                </button>
              </div>

              {services.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-[#2C2421]/60">
                  No service items in catalog yet. Add catalog items for customer booking picker.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {services.map((svc) => (
                    <div key={svc.id} className="p-4 bg-[#F8F8F5] rounded-xl border border-[#2C2421]/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#2C2421] block text-sm">{svc.name}</span>
                        <span className="text-xs font-semibold text-[#1F5C45]">PKR {svc.basePrice?.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-white border border-[#2C2421]/15 px-2 py-0.5 rounded font-bold">
                        {svc.durationMinutes} mins
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Analytics */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-3xl border border-[#2C2421]/15 p-6 shadow-xs space-y-3">
              <h3 className="font-headline text-lg font-bold text-[#2C2421]">Shop Analytics</h3>
              <p className="text-xs text-[#2C2421]/70">Revenue metrics, repair completion turnaround, and quality control fail rates.</p>

              {analytics ? (
                <div className="space-y-4 pt-2">
                  {/* Row 1: Core Financial & Operational KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10">
                      <span className="text-[10px] font-mono font-bold text-[#2C2421]/50 uppercase">Total Revenue</span>
                      <span className="font-headline text-xl font-bold text-[#111827] block mt-1">
                        PKR {analytics.revenue?.toLocaleString() || "0"}
                      </span>
                      <span className="text-[10px] text-[#1F5C45] font-semibold mt-0.5 block">Delivered &amp; Settled</span>
                    </div>

                    <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10">
                      <span className="text-[10px] font-mono font-bold text-[#2C2421]/50 uppercase">Active Workshop Jobs</span>
                      <span className="font-headline text-xl font-bold text-[#0284C7] block mt-1">
                        {analytics.summary?.activeJobs || 0} In Progress
                      </span>
                      <span className="text-[10px] text-[#2C2421]/60 font-medium mt-0.5 block">Intake to Road Test</span>
                    </div>

                    <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10">
                      <span className="text-[10px] font-mono font-bold text-[#2C2421]/50 uppercase">Completed Repairs</span>
                      <span className="font-headline text-xl font-bold text-[#1F5C45] block mt-1">
                        {analytics.completedCount || 0} Vehicles
                      </span>
                      <span className="text-[10px] text-[#2C2421]/60 font-medium mt-0.5 block">100% Turnaround</span>
                    </div>

                    <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10">
                      <span className="text-[10px] font-mono font-bold text-[#2C2421]/50 uppercase">Total Lifetime Bookings</span>
                      <span className="font-headline text-xl font-bold text-[#111827] block mt-1">
                        {analytics.summary?.totalBookings || 0} Orders
                      </span>
                      <span className="text-[10px] text-[#2C2421]/60 font-medium mt-0.5 block">All booking records</span>
                    </div>
                  </div>

                  {/* Row 2: Inventory & Quality Control Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inventory Analytics */}
                    <div className="p-5 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-bold text-sm text-[#2C2421]">Inventory Valuation &amp; Stock</span>
                        <span className="text-[10px] font-mono font-bold bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-0.5 rounded">
                          {analytics.inventorySummary?.totalCatalogItems || 0} SKUs Cataloged
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-white p-3 rounded-xl border border-[#2C2421]/10">
                          <span className="text-[10px] text-[#2C2421]/60 uppercase font-mono font-bold">Total Stock Value</span>
                          <span className="font-headline text-base font-bold text-[#111827] block mt-0.5">
                            PKR {(analytics.inventorySummary?.totalValuationPKR || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#2C2421]/10">
                          <span className="text-[10px] text-[#2C2421]/60 uppercase font-mono font-bold">Low Stock Reorders</span>
                          <span className={`font-headline text-base font-bold block mt-0.5 ${analytics.inventorySummary?.lowStockCount > 0 ? "text-[#E85D22]" : "text-[#1F5C45]"}`}>
                            {analytics.inventorySummary?.lowStockCount || 0} Items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QC Quality Control Metrics */}
                    <div className="p-5 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-bold text-sm text-[#2C2421]">Quality Assurance (QC)</span>
                        <span className="text-[10px] font-mono font-bold bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded">
                          {analytics.qualityControl?.qcPassRatePercent ?? 100}% Pass Rate
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-white p-3 rounded-xl border border-[#2C2421]/10">
                          <span className="text-[10px] text-[#2C2421]/60 uppercase font-mono font-bold">Road Test Defect Rate</span>
                          <span className="font-headline text-base font-bold text-[#E85D22] block mt-0.5">
                            {analytics.qcFailRate || "0%"}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#2C2421]/10">
                          <span className="text-[10px] text-[#2C2421]/60 uppercase font-mono font-bold">Defect Logs Caught</span>
                          <span className="font-headline text-base font-bold text-[#111827] block mt-0.5">
                            {analytics.qualityControl?.totalQcIssuesLogged || 0} Issues
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-[#F8F8F5] rounded-2xl border border-[#2C2421]/10 text-center text-xs text-[#2C2421]/60 font-mono">
                  [Live Analytics Metrics Query Active]
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ADD SHOP MODAL */}
      {showAddShopModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#2C2421]/20 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-headline text-lg font-bold text-[#2C2421]">Create New Shop Branch</h3>
            {shopError && <div className="p-3 bg-[#E85D22]/10 text-[#E85D22] text-xs font-semibold rounded-xl">{shopError}</div>}
            <form onSubmit={handleCreateShop} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Shop Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Islamabad Auto Care"
                  value={newShopForm.name}
                  onChange={(e) => setNewShopForm({ ...newShopForm, name: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">City *</label>
                <input
                  required
                  type="text"
                  placeholder="Islamabad"
                  value={newShopForm.city}
                  onChange={(e) => setNewShopForm({ ...newShopForm, city: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={newShopForm.phone}
                  onChange={(e) => setNewShopForm({ ...newShopForm, phone: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Sector I-9 Industrial Area"
                  value={newShopForm.address}
                  onChange={(e) => setNewShopForm({ ...newShopForm, address: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddShopModal(false)} className="px-4 py-2.5 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#111827] text-white font-bold rounded-xl cursor-pointer">
                  Create Shop Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#2C2421]/20 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-headline text-lg font-bold text-[#2C2421]">Add Staff Member</h3>
            {staffError && <div className="p-3 bg-[#E85D22]/10 text-[#E85D22] text-xs font-semibold rounded-xl">{staffError}</div>}
            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Staff Email *</label>
                <input
                  required
                  type="email"
                  placeholder="tech@bayflow.demo"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Role *</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-bold text-[#2C2421]"
                >
                  <option value="SERVICE_ADVISOR">Service Advisor (Front Desk)</option>
                  <option value="TECHNICIAN">Technician (Mechanic)</option>
                  <option value="PARTS_PERSON">Parts Person (Inventory)</option>
                  <option value="QC_INSPECTOR">QC Inspector (Quality Control)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Password *</label>
                <input
                  required
                  type="password"
                  placeholder="Password (8+ chars)"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 py-2.5 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#111827] text-white font-bold rounded-xl cursor-pointer">
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#2C2421]/20 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-headline text-lg font-bold text-[#2C2421]">Add Service Catalog Item</h3>
            {serviceError && <div className="p-3 bg-[#E85D22]/10 text-[#E85D22] text-xs font-semibold rounded-xl">{serviceError}</div>}
            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Service Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Engine Remap & Tuning"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Base Price (PKR) *</label>
                <input
                  required
                  type="number"
                  value={serviceForm.basePrice}
                  onChange={(e) => setServiceForm({ ...serviceForm, basePrice: Number(e.target.value) })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={serviceForm.durationMinutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: Number(e.target.value) })}
                  className="w-full p-3 bg-[#F8F8F5] border border-[#2C2421]/15 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddServiceModal(false)} className="px-4 py-2.5 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#111827] text-white font-bold rounded-xl cursor-pointer">
                  Add Service Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
