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
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BlogPosts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
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
              <Label htmlFor="featuredImage">Imagen destacada (URL)</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
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
