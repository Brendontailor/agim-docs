// exemplos/arquitetura-modular/frontend/src/pages/Usuarios/Lista.tsx
// Página de listagem de usuários

import { useState } from 'react';
import { useUsuarios, useExcluirUsuario } from '@/hooks/useUsuarios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { PlusIcon, SearchIcon, EditIcon, Trash2Icon, Loader2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function UsuariosListaPage() {
  const [filtros, setFiltros] = useState({
    pagina: 1,
    limite: 20,
    busca: '',
  });
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<UsuarioResponse | null>(null);

  const { data, isLoading, error, refetch } = useUsuarios(filtros);
  const excluirMutation = useExcluirUsuario();
  const criarMutation = useCriarUsuario();
  const atualizarMutation = useAtualizarUsuario();

  const handleBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros((prev) => ({ ...prev, busca: e.target.value, pagina: 1 }));
  };

  const handlePaginaChange = (novaPagina: number) => {
    setFiltros((prev) => ({ ...prev, pagina: novaPagina }));
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await excluirMutation.mutateAsync(id);
      alert('Usuário excluído com sucesso');
    } catch (error) {
      alert('Erro ao excluir usuário');
    }
  };

  const handleSubmitForm = async (dados: { nome: string; email: string; senha?: string; roles?: string[] }) => {
    try {
      if (usuarioEditando) {
        await atualizarMutation.mutateAsync({ id: usuarioEditando.id, dados });
      } else {
        await criarMutation.mutateAsync(dados);
      }
      setIsModalAberto(false);
      setUsuarioEditando(null);
      refetch();
    } catch (error) {
      // Erro tratado pelo mutation
    }
  };

  const abrirModalCriar = () => {
    setUsuarioEditando(null);
    setIsModalAberto(true);
  };

  const abrirModalEditar = (usuario: UsuarioResponse) => {
    setUsuarioEditando(usuario);
    setIsModalAberto(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Erro ao carregar usuários: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button onClick={abrirModalCriar}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Busca e Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar por nome ou email..."
            value={filtros.busca}
            onChange={handleBusca}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.dados.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {usuario.roles.map((role) => (
                      <Badge key={role} variant="secondary">{role}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={usuario.ativo ? 'default' : 'destructive'}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(usuario.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => abrirModalEditar(usuario)}
                      disabled={atualizarMutation.isPending}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExcluir(usuario.id)}
                      disabled={excluirMutation.isPending}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {data && data.paginacao.totalPaginas > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((filtros.pagina - 1) * filtros.limite) + 1} a{' '}
            {Math.min(filtros.pagina * filtros.limite, data.paginacao.total)} de{' '}
            {data.paginacao.total} resultados
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginaChange(filtros.pagina - 1)}
              disabled={filtros.pagina === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginaChange(filtros.pagina + 1)}
              disabled={filtros.pagina === data.paginacao.totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Modal Criar/Editar */}
      {isModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">
                {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <UsuarioForm
                usuario={usuarioEditando}
                onSubmit={handleSubmitForm}
                onCancel={() => {
                  setIsModalAberto(false);
                  setUsuarioEditando(null);
                }}
                isLoading={criarMutation.isPending || atualizarMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de formulário separado para reutilização
interface UsuarioFormProps {
  usuario: UsuarioResponse | null;
  onSubmit: (dados: { nome: string; email: string; senha?: string; roles?: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function UsuarioForm({ usuario, onSubmit, onCancel, isLoading }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    senha: '',
    roles: usuario?.roles || ['user'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          placeholder="Nome completo"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@exemplo.com"
        />
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
          {usuario ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
        </label>
        <Input
          id="senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          required={!usuario}
          placeholder={usuario ? '••••••••' : 'Mínimo 8 caracteres'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Roles
        </label>
        <select
          name="roles"
          value={formData.roles.join(',')}
          onChange={(e) => setFormData({ ...formData, roles: e.target.value.split(',') })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          multiple
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">Segure Ctrl/Cmd para selecionar múltiplos</p>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : usuario ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}

export default UsuariosListaPage;