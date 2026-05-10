"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Package, Booking } from "@/lib/types";
import { Check, ArrowRight, LogOut, ChevronLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#F5F5F5] animate-pulse rounded-[16px] flex items-center justify-center text-sm text-[#6B6B6B]">Loading Map...</div>
});

const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

type Step = 1 | 2 | 3 | 4 | 5;

function statusBadge(status: string) {
  const map: Record<string, "amber" | "blue" | "lime" | "green" | "red"> = {
    pending: "amber",
    confirmed: "blue",
    in_progress: "lime",
    completed: "green",
    cancelled: "red",
  };
  return (
    <Badge variant={map[status] || "default"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);

  // Data
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Form state
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [location, setLocation] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, [router]);

  // Fetch packages
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d) => setPackages(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/admin/bookings?from=${selectedDate}&to=${selectedDate}&status=all`)
      .then((r) => r.json())
      .then((d) => {
        const slots = (d.data || []).map((b: Booking) => b.time_slot);
        setBookedSlots(slots);
      })
      .catch(console.error);
  }, [selectedDate]);

  const fetchMyBookings = async () => {
    if (!user) return;
    setBookingsLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/bookings/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedPackage) return;
    setSubmitting(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          vehicle,
          location,
          notes,
          date: selectedDate,
          time_slot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingId(data.bookingId);
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#C8F135]" />
            <span className="font-bold text-[#0D0D0D]">MotorGlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B6B6B] hidden sm:block">
              {user?.phoneNumber}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] transition-colors cursor-pointer"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl border border-[#E5E5E5] p-1 max-w-xs">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 text-sm py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              step !== 5 ? "bg-[#0D0D0D] text-white" : "text-[#6B6B6B] hover:text-[#0D0D0D]"
            }`}
          >
            Book a Wash
          </button>
          <button
            onClick={() => { setStep(5); fetchMyBookings(); }}
            className={`flex-1 text-sm py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              step === 5 ? "bg-[#0D0D0D] text-white" : "text-[#6B6B6B] hover:text-[#0D0D0D]"
            }`}
          >
            My Bookings
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-1">Choose a package</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Select the service that fits your needs.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                      selectedPackage?.id === pkg.id
                        ? "border-[#C8F135]"
                        : "border-[#E5E5E5]"
                    }`}
                  >
                    {pkg.is_popular && (
                      <span className="absolute -top-2.5 right-3 bg-[#C8F135] text-[#0D0D0D] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                    {selectedPackage?.id === pkg.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#C8F135] flex items-center justify-center">
                        <Check size={12} className="text-[#0D0D0D]" />
                      </div>
                    )}
                    <h3 className="font-bold text-[#0D0D0D] mb-0.5">{pkg.name}</h3>
                    <p className="text-xs text-[#6B6B6B] mb-3">{pkg.tagline}</p>
                    <div className="text-xl font-bold text-[#0D0D0D] mb-3">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {pkg.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-[#6B6B6B]">
                          <Check size={12} className="shrink-0 mt-0.5 text-[#0D0D0D]" /> {f}
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-xs text-[#6B6B6B]">
                          +{pkg.features.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              <Button
                variant="accent"
                onClick={() => setStep(2)}
                disabled={!selectedPackage}
                className="group"
              >
                Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] mb-4 cursor-pointer">
                <ChevronLeft size={15} /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-1">Your location</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Tell us where your car is parked.</p>

              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col gap-4 max-w-xl">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-sm font-medium block">Parking spot / address *</label>
                    <button 
                      onClick={() => setIsMapOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-[#0D0D0D] text-[#C8F135] hover:bg-[#1a1a1a] transition-colors shadow-sm"
                    >
                      <MapPin size={12} /> Pick on Map
                    </button>
                  </div>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Level 2, Spot B-14, Phoenix Mall"
                    className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Vehicle number plate *</label>
                  <input
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                    placeholder="e.g. TN 10 AB 1234"
                    className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Notes for our team <span className="text-[#6B6B6B] font-normal">(optional)</span></label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Dark green hatchback, near the elevator"
                    rows={3}
                    className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20 resize-none"
                  />
                </div>
                <Button
                  variant="accent"
                  onClick={() => setStep(3)}
                  disabled={!location || !vehicle}
                  className="group self-start"
                >
                  Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] mb-4 cursor-pointer">
                <ChevronLeft size={15} /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-1">Pick a time</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Choose a date and available time slot.</p>

              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 max-w-xl flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
                    className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium block mb-2">Time slot *</label>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer ${
                              isBooked
                                ? "bg-[#F5F5F5] text-[#ccc] cursor-not-allowed"
                                : isSelected
                                ? "bg-[#0D0D0D] text-white"
                                : "bg-[#F5F5F5] text-[#0D0D0D] hover:bg-[#E5E5E5]"
                            }`}
                          >
                            {slot}
                            {isBooked && (
                              <span className="ml-1 text-xs">(Booked)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button
                  variant="accent"
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedSlot}
                  className="group self-start"
                >
                  Review order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && !bookingId && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <button onClick={() => setStep(3)} className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0D0D0D] mb-4 cursor-pointer">
                <ChevronLeft size={15} /> Back
              </button>
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-1">Confirm your booking</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Review the details before confirming.</p>

              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 max-w-xl">
                <dl className="flex flex-col gap-4">
                  {[
                    ["Package", selectedPackage?.name],
                    ["Price", `₹${selectedPackage?.price.toLocaleString("en-IN")}`],
                    ["Date", selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""],
                    ["Time", selectedSlot],
                    ["Location", location],
                    ["Vehicle", vehicle],
                    ...(notes ? [["Notes", notes] as [string, string]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-3 border-b border-[#E5E5E5] last:border-0">
                      <dt className="text-sm text-[#6B6B6B]">{label}</dt>
                      <dd className="text-sm font-medium text-[#0D0D0D] text-right max-w-[60%]">{value}</dd>
                    </div>
                  ))}
                </dl>

                {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

                <Button
                  variant="accent"
                  className="w-full mt-6 group"
                  onClick={handleConfirmBooking}
                  loading={submitting}
                >
                  Confirm Booking <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && bookingId && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 max-w-sm mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[#C8F135] flex items-center justify-center mx-auto mb-5">
                <Check size={28} className="text-[#0D0D0D]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-2">Booking confirmed!</h2>
              <p className="text-[#6B6B6B] text-sm mb-1">Your car wash is on its way.</p>
              <p className="text-xs text-[#6B6B6B]">Booking ID: <span className="font-mono text-[#0D0D0D]">{bookingId}</span></p>
              <div className="flex gap-3 justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(5);
                    setBookingId("");
                    fetchMyBookings();
                  }}
                >
                  View My Bookings
                </Button>
                <Button
                  variant="accent"
                  onClick={() => {
                    setStep(1);
                    setBookingId("");
                    setSelectedPackage(null);
                    setLocation("");
                    setVehicle("");
                    setNotes("");
                    setSelectedDate("");
                    setSelectedSlot("");
                  }}
                >
                  Book Another
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <h2 className="text-2xl font-bold text-[#0D0D0D] mb-1">My Bookings</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Your booking history.</p>

              {bookingsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : myBookings.length === 0 ? (
                <div className="text-center py-12 text-[#6B6B6B]">
                  <p>No bookings yet.</p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-3 text-sm font-medium text-[#0D0D0D] underline cursor-pointer"
                  >
                    Book your first wash →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-2xl border border-[#E5E5E5]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        {["ID", "Package", "Date", "Time", "Status"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {myBookings.map((b) => (
                        <tr key={b.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5]">
                          <td className="px-4 py-3 font-mono text-xs text-[#6B6B6B]">{b.id.slice(0, 8)}…</td>
                          <td className="px-4 py-3 font-medium text-[#0D0D0D]">{b.package_name}</td>
                          <td className="px-4 py-3 text-[#6B6B6B]">{new Date(b.date + "T00:00:00").toLocaleDateString("en-IN")}</td>
                          <td className="px-4 py-3 text-[#6B6B6B]">{b.time_slot}</td>
                          <td className="px-4 py-3">{statusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Modal open={isMapOpen} onClose={() => setIsMapOpen(false)} title="Select Location on Map" className="sm:max-w-xl">
        {isMapOpen && (
          <MapPicker
            onLocationSelect={(addr) => setLocation(addr)}
            onClose={() => setIsMapOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
