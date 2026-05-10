"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Package } from "@/lib/types";
import { Save } from "lucide-react";

interface EditablePackage extends Package {
  featuresText: string;
  saving: boolean;
  saved: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<EditablePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data: Package[]) => {
        setPackages(
          data.map((p) => ({
            ...p,
            featuresText: p.features.join("\n"),
            saving: false,
            saved: false,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateField = (id: string, field: string, value: unknown) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value, saved: false } : p))
    );
  };

  const handleSave = async (pkg: EditablePackage) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, saving: true } : p))
    );

    const features = pkg.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pkg.name,
          tagline: pkg.tagline,
          price: Number(pkg.price),
          features,
          is_popular: pkg.is_popular,
        }),
      });

      // If we set this as popular, update others locally
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? { ...p, saving: false, saved: true, features }
            : pkg.is_popular
            ? { ...p, is_popular: false }
            : p
        )
      );
    } catch {
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, saving: false } : p))
      );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-[100svh] bg-[#F5F5F5] pb-20 sm:pb-0">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-auto w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0D0D0D] mb-2">Packages</h1>
          <p className="text-sm text-[#6B6B6B] mb-6">
            Changes save to the database instantly and reflect on the landing page.
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
                    <input
                      value={pkg.name}
                      onChange={(e) => updateField(pkg.id, "name", e.target.value)}
                      className="text-lg font-bold text-[#0D0D0D] bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-[#C8F135]/20 rounded-lg px-1 -ml-1 w-auto"
                    />
                    {pkg.saved && (
                      <span className="text-xs text-green-600 font-medium">✓ Saved</span>
                    )}
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1.5">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updateField(pkg.id, "price", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1.5">
                        Tagline
                      </label>
                      <input
                        value={pkg.tagline || ""}
                        onChange={(e) => updateField(pkg.id, "tagline", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide block mb-1.5">
                        Features <span className="font-normal normal-case">(one per line)</span>
                      </label>
                      <textarea
                        value={pkg.featuresText}
                        onChange={(e) => updateField(pkg.id, "featuresText", e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2.5 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20 resize-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between">
                      <Toggle
                        checked={pkg.is_popular}
                        onChange={(v) => updateField(pkg.id, "is_popular", v)}
                        label='Mark as "Most Popular"'
                      />
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleSave(pkg)}
                        loading={pkg.saving}
                        className="group"
                      >
                        <Save size={14} /> Save changes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
