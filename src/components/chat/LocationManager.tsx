import { useState, useEffect } from "react";
import { MapPin, Navigation, Edit, Check, X, Loader2, ChevronLeft } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getAddressFromCoords } from "@/app/actions/get-address";
import { toast } from "sonner";

interface LocationManagerProps {
    onLocationSelected: (location: string) => void;
    onCancel: () => void;
}

type Mode = "SELECTION" | "FETCHING_GPS" | "CONFIRM_GPS" | "MANUAL_ENTRY";

export function LocationManager({ onLocationSelected, onCancel }: LocationManagerProps) {
    const [mode, setMode] = useState<Mode>("SELECTION");
    const [address, setAddress] = useState("");
    const [manualDetails, setManualDetails] = useState({
        street: "",
        landmark: "",
        pincode: ""
    });

    const { getLocation, latitude, longitude, isLoading, error } = useGeolocation();

    // Handle GPS Fetch
    useEffect(() => {
        if (mode === "FETCHING_GPS" && latitude !== null && longitude !== null) {
            const fetchAddress = async () => {
                try {
                    const addr = await getAddressFromCoords(latitude, longitude);
                    if (addr) {
                        setAddress(addr);
                        setMode("CONFIRM_GPS");
                    } else {
                        toast.error("Could not fetch address. Please enter manually.");
                        setMode("MANUAL_ENTRY");
                    }
                } catch (e) {
                    console.error("Address fetch failed", e);
                    toast.error("Address lookup failed. Please enter manually.");
                    setMode("MANUAL_ENTRY");
                }
            };
            fetchAddress();
        }
    }, [mode, latitude, longitude]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            setMode("MANUAL_ENTRY");
        }
    }, [error]);

    const handleGetLocation = () => {
        setMode("FETCHING_GPS");
        getLocation();
    };

    const handleManualSubmit = () => {
        const { street, landmark, pincode } = manualDetails;
        if (!street.trim()) return toast.error("Street address is required");

        const fullAddress = `${street}, ${landmark ? landmark + ", " : ""}${pincode}`;
        onLocationSelected(fullAddress);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <GlassPanel className="w-full max-w-md p-6 relative animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                    {mode !== "SELECTION" ? (
                        <button
                            onClick={() => setMode("SELECTION")}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-500" />
                        </button>
                    ) : (
                        <div className="w-7" />
                    )}

                    <button
                        onClick={onCancel}
                        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* SELECTION MODE */}
                {mode === "SELECTION" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Share Location</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Help us find the issue faster.</p>
                        </div>

                        <button
                            onClick={handleGetLocation}
                            className="w-full p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all flex items-center gap-4 group"
                        >
                            <div className="p-2 rounded-full bg-blue-500 text-white shadow-md group-hover:scale-110 transition-transform">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-slate-900 dark:text-white">Get My Location</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Auto-detect via GPS</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setMode("MANUAL_ENTRY")}
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-4 group"
                        >
                            <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform">
                                <Edit className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-slate-900 dark:text-white">Enter Manually</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Type address & landmark</span>
                            </div>
                        </button>

                        <button
                            onClick={() => onLocationSelected("Skipped Location")}
                            className="w-full py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            Don't give location
                        </button>
                    </div>
                )}

                {/* FETCHING GPS */}
                {mode === "FETCHING_GPS" && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-600 dark:text-slate-300 font-medium">Fetching precise location...</p>
                    </div>
                )}

                {/* CONFIRM GPS */}
                {mode === "CONFIRM_GPS" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Confirm Location</h3>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{address}</p>
                                    <p className="text-xs text-slate-500 mt-1">Lat: {latitude?.toFixed(4)}, Long: {longitude?.toFixed(4)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setMode("MANUAL_ENTRY")}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onLocationSelected(address)}
                                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Confirm
                            </button>
                        </div>
                    </div>
                )}

                {/* MANUAL ENTRY */}
                {mode === "MANUAL_ENTRY" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Enter Address</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500 ml-1">Street / Area *</label>
                                <input
                                    type="text"
                                    value={manualDetails.street}
                                    onChange={e => setManualDetails({ ...manualDetails, street: e.target.value })}
                                    className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. 123 MG Road"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 ml-1">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    value={manualDetails.landmark}
                                    onChange={e => setManualDetails({ ...manualDetails, landmark: e.target.value })}
                                    className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. Near City Hospital"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 ml-1">Pincode (Optional)</label>
                                <input
                                    type="text"
                                    value={manualDetails.pincode}
                                    onChange={e => setManualDetails({ ...manualDetails, pincode: e.target.value })}
                                    className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. 560001"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleManualSubmit}
                            className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all mt-2"
                        >
                            Submit Location
                        </button>
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
