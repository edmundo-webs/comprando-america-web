import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Eye, Upload, Loader2, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

async function generateBrandedImage(title: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1792;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Navy gradient background
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#0B1F3A");
  grad.addColorStop(0.5, "#0E2544");
  grad.addColorStop(1, "#091A30");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(37, 99, 235, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Blue accent glow (top-right)
  const glowGrad = ctx.createRadialGradient(1400, 200, 50, 1400, 200, 500);
  glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)");
  glowGrad.addColorStop(1, "rgba(37, 99, 235, 0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Blue accent line (left)
  ctx.fillStyle = "#2563EB";
  ctx.fillRect(120, 340, 4, 200);

  // "COMPRANDO AMÉRICA" tag
  ctx.font = "600 18px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = "#3B82F6";
  ctx.letterSpacing = "8px";
  ctx.fillText("COMPRANDO AMÉRICA", 150, 400);

  // Title — word wrap
  ctx.font = "700 64px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.letterSpacing = "-1px";
  const maxWidth = 1400;
  const lineHeight = 80;
  const words = title.split(" ");
  let line = "";
  let y = 480;
  const lines: string[] = [];

  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);

  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].slice(0, -3) + "...";
  }

  for (const l of displayLines) {
    ctx.fillText(l, 150, y);
    y += lineHeight;
  }

  // Bottom bar
  ctx.fillStyle = "rgba(37, 99, 235, 0.3)";
  ctx.fillRect(0, canvas.height - 4, canvas.width, 4);

  // "comprandoamerica.com" bottom right
  ctx.font = "400 20px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
  ctx.textAlign = "right";
  ctx.fillText("comprandoamerica.com", canvas.width - 120, canvas.height - 40);
  ctx.textAlign = "left";

  // Convert to blob and upload
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), "image/png", 0.95);
  });

  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve) => {
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      data: base64,
      filename: `blog-cover-${Date.now()}.png`,
      contentType: "image/png",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Error subiendo imagen");
  }

  const { url } = await res.json();
  return url;
}

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            data: base64,
            filename: file.name,
            contentType: file.type,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || "Error al subir imagen");
        }
        const { url } = await res.json();
        resolve(url);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.readAsDataURL(file);
  });
}

export default function BlogPosts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingBranded, setGeneratingBranded] = useState(false);
  const featuredImageRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  const { data: posts, isLoading, refetch } = trpc.blogPosts.listAll.useQuery();
  const createMutation = trpc.blogPosts.create.useMutation({
    onSuccess: () => {
      toast.success("Blog creado exitosamente");
      refetch();
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateMutation = trpc.blogPosts.update.useMutation({
    onSuccess: () => {
      toast.success("Blog actualizado exitosamente");
      refetch();
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteMutation = trpc.blogPosts.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog eliminado exitosamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "draft",
    });
    setSelectedPost(null);
  };

  const handleCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      featuredImage: post.featuredImage || "",
      status: post.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    if (selectedPost) {
      updateMutation.mutate({
        id: selectedPost.id,
        ...formData,
        publishedAt: formData.status === "published" ? new Date() : undefined,
      });
    } else {
      createMutation.mutate({
        ...formData,
        publishedAt: formData.status === "published" ? new Date() : undefined,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este blog?")) {
      deleteMutation.mutate({ id });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  if (isLoading) {
    return <div className="p-8">Cargando blogs...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Gestiona el contenido del blog</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Blog
        </Button>
      </div>

      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{post.slug}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-500/10 text-green-600"
                        : post.status === "draft"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? "Editar Blog" : "Nuevo Blog"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({ ...formData, title, slug: generateSlug(title) });
                }}
                placeholder="Título del blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-amigable-del-blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve descripción del blog"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Contenido *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Escribe el contenido del blog aquí..."
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen destacada</Label>
              <div className="space-y-3">
                {formData.featuredImage && (
                  <div className="relative">
                    <img src={formData.featuredImage} alt="Preview" className="w-full max-h-48 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featuredImage: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => featuredImageRef.current?.click()}
                    className="gap-2"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Subiendo..." : "Subir imagen"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={generatingBranded || !formData.title}
                    onClick={async () => {
                      if (!formData.title) {
                        toast.error("Escribe un título primero");
                        return;
                      }
                      setGeneratingBranded(true);
                      try {
                        const url = await generateBrandedImage(formData.title);
                        setFormData(prev => ({ ...prev, featuredImage: url }));
                        toast.success("Portada generada exitosamente");
                      } catch (err: any) {
                        toast.error(err.message || "Error generando portada");
                      } finally {
                        setGeneratingBranded(false);
                      }
                    }}
                    className="gap-2"
                  >
                    {generatingBranded ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generatingBranded ? "Generando..." : "Generar portada"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={generating || !formData.title}
                    onClick={async () => {
                      if (!formData.title) {
                        toast.error("Escribe un título primero");
                        return;
                      }
                      setGenerating(true);
                      try {
                        const res = await fetch("/api/generate-image", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ title: formData.title, excerpt: formData.excerpt }),
                        });
                        if (!res.ok) {
                          const err = await res.json().catch(() => ({ error: res.statusText }));
                          throw new Error(err.error || "Error generando imagen");
                        }
                        const { url } = await res.json();
                        setFormData(prev => ({ ...prev, featuredImage: url }));
                        toast.success("Imagen generada con IA exitosamente");
                      } catch (err: any) {
                        toast.error(err.message || "Error generando imagen");
                      } finally {
                        setGenerating(false);
                      }
                    }}
                    className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generating ? "Generando..." : "Generar con IA"}
                  </Button>
                  <Input
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="o pegar URL directamente"
                    className="flex-1 min-w-[200px]"
                  />
                </div>
                <input
                  ref={featuredImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const url = await uploadImage(file);
                      setFormData(prev => ({ ...prev, featuredImage: url }));
                      toast.success("Imagen subida exitosamente");
                    } catch (err: any) {
                      toast.error(err.message || "Error al subir imagen");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published" | "archived") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
