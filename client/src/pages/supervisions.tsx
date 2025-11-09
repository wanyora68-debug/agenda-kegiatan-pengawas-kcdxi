import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Printer, Image as ImageIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supervisionsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Supervision = {
  id: string;
  school: string;
  type: string;
  date: string;
  findings: string;
  recommendations: string;
  photo1?: string | null;
  photo2?: string | null;
};

export default function SupervisionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupervision, setNewSupervision] = useState({
    school: "",
    type: "Akademik",
    findings: "",
    recommendations: "",
  });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // Fetch supervisions from API
  const { data: supervisions = [], isLoading } = useQuery({
    queryKey: ['supervisions'],
    queryFn: supervisionsApi.getAll,
  });

  // Create supervision mutation
  const createSupervisionMutation = useMutation({
    mutationFn: supervisionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisions'] });
      toast({
        title: "Berhasil",
        description: "Supervisi berhasil ditambahkan",
      });
      setNewSupervision({ school: "", type: "Akademik", findings: "", recommendations: "" });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete supervision mutation
  const deleteSupervisionMutation = useMutation({
    mutationFn: supervisionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisions'] });
      toast({
        title: "Berhasil",
        description: "Supervisi berhasil dihapus",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddSupervision = async () => {
    const formData = new FormData();
    formData.append('school', newSupervision.school);
    formData.append('type', newSupervision.type);
    formData.append('findings', newSupervision.findings);
    formData.append('recommendations', newSupervision.recommendations);
    formData.append('date', new Date().toISOString().split('T')[0]);
    
    if (photo1) formData.append('photo1', photo1);
    if (photo2) formData.append('photo2', photo2);

    createSupervisionMutation.mutate(formData);
  };

  const groupBySchool = () => {
    const grouped: { [key: string]: Supervision[] } = {};
    supervisions.forEach((supervision: Supervision) => {
      if (!grouped[supervision.school]) {
        grouped[supervision.school] = [];
      }
      grouped[supervision.school].push(supervision);
    });
    return grouped;
  };

  const deleteSupervision = (id: string) => {
    deleteSupervisionMutation.mutate(id);
  };

  const getTypeColor = (type: string) => {
    return type === "Akademik" 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  };

  const handlePrintSupervision = (supervision: Supervision) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const photos = [];
    if (supervision.photo1) photos.push({ url: `/uploads/${supervision.photo1}`, label: 'Foto 1' });
    if (supervision.photo2) photos.push({ url: `/uploads/${supervision.photo2}`, label: 'Foto 2' });
    
    const photosHtml = photos.length > 0
      ? `
        <div style="margin-top: 25px;">
          <h3 style="color: #2563eb; margin-bottom: 15px;">Foto Supervisi:</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            ${photos.map(photo => `
              <div>
                <img src="${photo.url}" alt="${photo.label}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; border: 2px solid #e5e7eb;" />
                <p style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">${photo.label}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Supervisi - ${supervision.school}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 15px;
              padding: 10px;
              background: #f9fafb;
              border-radius: 5px;
            }
            .info-label {
              font-weight: bold;
              width: 180px;
              color: #555;
            }
            .info-value {
              flex: 1;
              color: #333;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 500;
              background: ${supervision.type === 'Akademik' ? '#dbeafe' : '#dcfce7'};
              color: ${supervision.type === 'Akademik' ? '#1e40af' : '#166534'};
            }
            .section {
              margin-top: 25px;
              padding: 15px;
              background: #f9fafb;
              border-left: 4px solid #2563eb;
              border-radius: 5px;
            }
            .section-title {
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Laporan Supervisi</h1>
          <div class="info-row">
            <div class="info-label">Sekolah:</div>
            <div class="info-value">${supervision.school}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jenis Supervisi:</div>
            <div class="info-value"><span class="badge">${supervision.type}</span></div>
          </div>
          <div class="info-row">
            <div class="info-label">Tanggal:</div>
            <div class="info-value">${new Date(supervision.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jumlah Foto:</div>
            <div class="info-value">${[supervision.photo1, supervision.photo2].filter(Boolean).length} foto</div>
          </div>
          <div class="section">
            <div class="section-title">Temuan:</div>
            <div>${supervision.findings}</div>
          </div>
          <div class="section">
            <div class="section-title">Rekomendasi:</div>
            <div>${supervision.recommendations}</div>
          </div>
          ${photosHtml}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kegiatan Supervisi</h1>
          <p className="text-muted-foreground mt-1">Catat hasil supervisi akademik dan manajerial</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-supervision">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Supervisi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Supervisi Baru</DialogTitle>
              <DialogDescription>Catat hasil supervisi ke sekolah binaan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervision-school">Sekolah</Label>
                  <Input
                    id="supervision-school"
                    value={newSupervision.school}
                    onChange={(e) => setNewSupervision({ ...newSupervision, school: e.target.value })}
                    placeholder="Nama sekolah"
                    data-testid="input-supervision-school"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervision-type">Jenis Supervisi</Label>
                  <Select value={newSupervision.type} onValueChange={(value) => setNewSupervision({ ...newSupervision, type: value })}>
                    <SelectTrigger id="supervision-type" data-testid="select-supervision-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Akademik">Akademik</SelectItem>
                      <SelectItem value="Manajerial">Manajerial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-findings">Temuan / Hasil Supervisi</Label>
                <Textarea
                  id="supervision-findings"
                  value={newSupervision.findings}
                  onChange={(e) => setNewSupervision({ ...newSupervision, findings: e.target.value })}
                  placeholder="Catatan hasil supervisi"
                  rows={4}
                  data-testid="input-supervision-findings"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervision-recommendations">Rekomendasi</Label>
                <Textarea
                  id="supervision-recommendations"
                  value={newSupervision.recommendations}
                  onChange={(e) => setNewSupervision({ ...newSupervision, recommendations: e.target.value })}
                  placeholder="Saran dan rekomendasi"
                  rows={3}
                  data-testid="input-supervision-recommendations"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto (Maksimal 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={photo1InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto1(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto1Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo1InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo1Preview ? (
                        <>
                          <img src={photo1Preview} alt="Preview 1" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto1(null);
                              setPhoto1Preview(null);
                              if (photo1InputRef.current) photo1InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 1</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      ref={photo2InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto2(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto2Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo2InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo2Preview ? (
                        <>
                          <img src={photo2Preview} alt="Preview 2" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto2(null);
                              setPhoto2Preview(null);
                              if (photo2InputRef.current) photo2InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 2</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-supervision">
                  Batal
                </Button>
                <Button onClick={handleAddSupervision} disabled={!newSupervision.school || !newSupervision.findings} data-testid="button-save-supervision">
                  Simpan Supervisi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-supervisions">Semua Supervisi</TabsTrigger>
          <TabsTrigger value="byschool" data-testid="tab-by-school">Per Sekolah</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {supervisions.map((supervision: Supervision) => (
            <Card key={supervision.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{supervision.school}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getTypeColor(supervision.type)} variant="secondary">
                        {supervision.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{supervision.date}</span>
                      {(supervision.photo1 || supervision.photo2) && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {[supervision.photo1, supervision.photo2].filter(Boolean).length} foto
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePrintSupervision(supervision)} data-testid={`button-print-supervision-${supervision.id}`}>
                      <Printer className="h-4 w-4 mr-2" />
                      Cetak
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteSupervision(supervision.id)} data-testid={`button-delete-supervision-${supervision.id}`}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Temuan:</p>
                  <p className="text-sm text-muted-foreground">{supervision.findings}</p>
                </div>
                {supervision.recommendations && (
                  <div>
                    <p className="text-sm font-medium mb-1">Rekomendasi:</p>
                    <p className="text-sm text-muted-foreground">{supervision.recommendations}</p>
                  </div>
                )}
                {(supervision.photo1 || supervision.photo2) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Foto Supervisi:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {supervision.photo1 && (
                        <img 
                          src={`/uploads/${supervision.photo1}`} 
                          alt="Foto 1" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                      {supervision.photo2 && (
                        <img 
                          src={`/uploads/${supervision.photo2}`} 
                          alt="Foto 2" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="byschool" className="space-y-6 mt-6">
          {Object.entries(groupBySchool()).map(([school, schoolSupervisions]) => (
            <Card key={school}>
              <CardHeader>
                <CardTitle>{school}</CardTitle>
                <p className="text-sm text-muted-foreground">{schoolSupervisions.length} supervisi tercatat</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {schoolSupervisions.map((supervision) => (
                  <div key={supervision.id} className="border-l-4 border-primary pl-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(supervision.type)} variant="secondary">
                        {supervision.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{supervision.date}</span>
                    </div>
                    <p className="text-sm">{supervision.findings}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
