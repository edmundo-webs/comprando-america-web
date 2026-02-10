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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Users() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" as "user" | "admin" });

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();
  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success("Usuario actualizado exitosamente");
      refetch();
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => {
      toast.success("Usuario eliminado exitosamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({ name: user.name || "", email: user.email || "", role: user.role });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedUser) return;
    updateMutation.mutate({
      id: selectedUser.id,
      ...formData,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="p-8">Cargando usuarios...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Usuarios</h1>
          <p className="text-muted-foreground mt-2">Gestiona los usuarios del sistema</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === "admin"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value: "user" | "admin") => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
