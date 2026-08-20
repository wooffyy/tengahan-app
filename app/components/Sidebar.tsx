"use client";
import { Friend } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Share2, Plus, MapPin } from "lucide-react";

interface SidebarProps {
  inputName: string;
  setInputName: (name: string) => void;
  onGetLocation: () => void;
  onSearch: () => void;
  isLoading: boolean;
  friends: Friend[];
}

export default function Sidebar({
  inputName,
  setInputName,
  onGetLocation,
  onSearch,
  isLoading,
  friends,
}: SidebarProps) {
  
  // Function dummy buat share 
  const handleShare = () => {
    navigator.clipboard.writeText("todo");
  };

  return (
  <aside className="w-full md:w-96 bg-background text-foreground p-6 flex flex-col justify-between h-full border-r border-border">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">tengahan</h1>

      <div className="space-y-3">
        <Input className="py-4" placeholder="Nama temanmu" value={inputName} onChange={(e) => setInputName(e.target.value)} />
        <Input className="py-4" placeholder="Alamat temanmu" />

        <div className="grid grid-cols-2 gap-2">
          <Button className="py-4" variant="outline" size="sm" onClick={onGetLocation}>
            <Plus className="mr-1 h-4 w-4" /> Tambah
          </Button>
          <Button className="py-4" variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" /> Bagikan
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Daftar Teman ({friends.length})</p>
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