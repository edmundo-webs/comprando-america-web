import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, UserPlus, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Users() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", role: "user" as "user" | "admin", password: "" });
  const [createFormData, setCreateFormData] = useState({ name: "", email: "", password: "", role: "user" as "user" | "admin" });

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();

  const createMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      toast.success("Usuario creado exitosamente");
      refetch();
      setCreateDialogOpen(false);
      setCreateFormData({ name: "", email: "", password: "", role: "user" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
    setEditFormData({ name: user.name || "", email: user.email || "", role: user.role, password: "" });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedUser) return;
    const data: any = {
      id: selectedUser.id,
      name: editFormData.name,
      email: editFormData.email,
      role: editFormData.role,
    };
    if (editFormData.password) {
      data.password = editFormData.password;
    }
    updateMutation.mutate(data);
  };

  const handleCreate = () => {
    if (!createFormData.name || !createFormData.email || !createFormData.password) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    createMutation.mutate(createFormData);
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
          <p className="text-muted-foreground mt-2">Gestiona los usuarios del CMS</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="bg-card border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name || "—"}</TableCell>
                <TableCell className="text-sm">{user.email || "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}>
                    {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.loginMethod === "email" ? "Email" : "OAuth"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString("es-MX", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  }) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!users || users.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nombre *</Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                placeholder="usuario@comprandoamerica.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Contraseña *</Label>
              <Input
                id="create-password"
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Rol</Label>
              <Select value={createFormData.role} onValueChange={(value: "user" | "admin") => setCreateFormData({ ...createFormData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Nueva Contraseña (dejar vacío para no cambiar)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                placeholder="Dejar vacío para mantener la actual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={editFormData.role} onValueChange={(value: "user" | "admin") => setEditFormData({ ...editFormData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
