"use client";
import { Friend } from "../types/index";
import { searchAddress, LocResult } from "../utils/geocoding";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Share2, Plus, MapPin } from "lucide-react";
import { POIToggle } from "./POIToggle";

interface SidebarProps {
  inputName: string;
  setInputName: (name: string) => void;
  onGetLocation: () => void;
  onSearch: () => void;
  onAddFriend: (displayName: string, lat: number, lng: number) => void;
  isLoading: boolean;
  friends: Friend[];
  category: string[];
  setCategory: (val: string[]) => void;
  anyInput: string;
  setAnyInput: (val: string) => void;
}

export default function Sidebar({
  inputName,
  setInputName,
  onGetLocation,
  onSearch,
  onAddFriend,
  isLoading,
  friends,
  category,
  setCategory,
  anyInput,
  setAnyInput,
}: SidebarProps) {

  const [addressInput, setAddressInput] = useState("");
  const [searchResults, setSearchResults] = useState<LocResult[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<LocResult | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const handleAddressChange = async (val: string) => {
    setAddressInput(val);
    setSelectedLoc(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 3) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;

      try {
        const results = await searchAddress(val);
        if (thisRequestId === requestIdRef.current) {
          setSearchResults(results);
        }
      } catch {
        if (thisRequestId === requestIdRef.current) {
          setSearchResults([]);
        }
      }
    }, 400);
  };

  const handleSelectLoc = (loc: LocResult) => {
    setSelectedLoc(loc);
    setAddressInput(loc.displayName);
    setSearchResults([]);
  };

  const handleAddClick = () => {
    if (!inputName) return alert("Isi nama temanmu dulu!");
    if (!selectedLoc) return alert("Pilih alamat dari daftar rekomendasi!");

    onAddFriend(inputName, selectedLoc.lat, selectedLoc.lng);
    setInputName("");
    setAddressInput("");
    setSelectedLoc(null);
  };
  
  // Function dummy buat share 
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link berhasil disalin!");
  };

  return (
  <aside className="w-full md:w-96 bg-background text-foreground p-6 flex flex-col justify-between h-full border-r border-border">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">tengahan</h1>

      <div className="space-y-3">
        <Input className="py-4" placeholder="Nama temanmu" value={inputName} onChange={(e) => setInputName(e.target.value)} />
        <div className="relative">
            <Input
              className="py-4"
              placeholder="Alamat temanmu"
              value={addressInput}
              onChange={(e) => handleAddressChange(e.target.value)}
            />

            {searchResults.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLoc(loc)}
                    className="w-full text-left p-2 text-xs hover:bg-accent border-b border-border last:border-0 truncate block"
                  >
                  {loc.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="py-4" variant="outline" size="sm" onClick={onGetLocation}>
            <MapPin className="mr-1 h-4 w-4" /> Lokasiku
          </Button>
          <Button className="py-4" variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" /> Bagikan
          </Button>
        </div>
        <Button className="w-full py-4" size="sm" onClick={handleAddClick}>
          <Plus className="mr-1 h-4 w-4" /> Tambah Teman
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold mb-4">Kalian mau ke mana hari ini?</h2>
        <POIToggle
          category={category}
          setCategory={setCategory}
          anyInput={anyInput}
          setAnyInput={setAnyInput}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold mb-2">Daftar Teman ({friends.length})</p>
        {friends.map((f) => (
          <Card key={f.id} className="bg-card">
            <CardContent className="px-3 py-0.5 flex justify-between items-center text-xs">
              <span>{f.name}</span>
              {f.isAdmin && <span className="text-[10px] bg-blue-500/20 text-primary px-2 py-0.5 rounded-full border border-blue-500/30">Admin</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <Button size="lg" className="w-full mt-6 font-bold" onClick={onSearch} disabled={isLoading || friends.length === 0}>
      {isLoading ? <h2 className="flex items-center gap-2"> <Spinner />Mencari</h2> : "Cari Tengahan"}
    </Button>
  </aside>
);
}