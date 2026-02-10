import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Eye, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: users } = trpc.users.list.useQuery();
  const { data: posts } = trpc.blogPosts.listAll.useQuery();

  const stats = [
    {
      title: "Total Usuarios",
      value: users?.length || 0,
      icon: Users,
      description: "Usuarios registrados en el sistema",
    },
    {
      title: "Total Blogs",
      value: posts?.length || 0,
      icon: FileText,
      description: "Posts creados en total",
    },
    {
      title: "Blogs Publicados",
      value: posts?.filter((p) => p.status === "published").length || 0,
      icon: Eye,
      description: "Posts visibles en el sitio",
    },
    {
      title: "Borradores",
      value: posts?.filter((p) => p.status === "draft").length || 0,
      icon: Clock,
      description: "Posts pendientes de publicación",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido al panel de administración de Comprando América
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts?.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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
                </div>
              ))}
              {!posts || posts.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay blogs aún</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{user.name || "Sin nombre"}</p>
                    <p className="text-sm text-muted-foreground">{user.email || "Sin email"}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
              {!users || users.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay usuarios aún</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
