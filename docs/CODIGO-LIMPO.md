# Padrões de Código Limpo

> Regras objetivas para código legível, manutenível e consistente.
> Baseada na Seção 5 da missão: "PADRÕES DE CÓDIGO LIMPO".

---

## Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Responsabilidade Única (SRP)** | Cada função, classe, módulo tem **uma** razão para mudar |
| **Baixo Acoplamento** | Módulos dependem de abstrações, não de implementações concretas |
| **Alta Coesão** | Funcionalidades relacionadas agrupadas; não relacionadas, separadas |
| **Nomenclatura Clara** | Nomes revelam intenção; português para domínio, inglês para tech |
| **Tipagem Explícita** | TypeScript strict mode; evitar `any`; tipos inferidos quando óbvios |
| **Funções Pequenas** | Uma função faz uma coisa; < 20 linhas ideal; < 50 linhas máximo |
| **Sem Duplicação (DRY)** | Extrair lógica comum; evitar copiar-colar |
| **Tratamento Explícito de Erros** | Nunca ignorar erros; `try/catch` com propósito; errors como valores |
| **Arquivos Focados** | < 300 linhas por arquivo; dividir quando crescer |
| **Sem Dependências Circulares** | Estrutura em camadas unidirecional |
| **Sem Abstrações Prematuras** | Generalizar só quando houver 2+ casos reais de uso |
| **Comentários Úteis** | Por quê, não o quê; decisões, trade-offs, algoritmos complexos |

---

## Nomenclatura (Português Brasileiro para Domínio)

### Arquivos e Pastas
```
kebab-case para arquivos e pastas
├── usuarios.controller.ts      # Controller
├── usuarios.service.ts         # Service
├── usuarios.repository.ts      # Repository
├── usuarios.validation.ts      # Validation schemas
├── usuarios.routes.ts          # Routes
├── usuario.types.ts            # Types (singular para tipos)
├── criar-usuario.dto.ts        # DTOs
└── usuario-nao-encontrado.error.ts  # Errors
```

### Código TypeScript

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| **Classes** | PascalCase | `UsuariosService`, `AuthMiddleware` |
| **Interfaces/Types** | PascalCase | `UsuarioResponse`, `CriarUsuarioDTO` |
| **Enums** | PascalCase, singular | `Role`, `StatusPedido` |
| **Funções/Variáveis** | camelCase | `obterPorId`, `listaUsuarios`, `ehValido` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_TENTATIVAS_LOGIN`, `HTTP_STATUS` |
| **Booleanos** | Prefixo `eh`, `tem`, `pode`, `deve` | `ehAdmin`, `temPermissao`, `podeAcessar` |
| **Funções assíncronas** | Verbo + substantivo | `buscarUsuario`, `salvarAlteracoes` |
| **Event handlers** | Prefixo `ao` ou `handle` | `aoClicarSalvar`, `handleSubmit` |
| **Generics** | `T`, `TEntity`, `TResponse` | `Repository<T>`, `ApiResponse<T>` |

### Nomes de Domínio (Português)
```typescript
// ✅ CORRETO - Domínio em português
interface Usuario {
  nome: string;
  email: string;
  dataNascimento: Date;
  ehAtivo: boolean;
}

async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> { }

// ❌ INCORRETO - Inglês misturado sem necessidade
interface User {
  name: string;
  email: string;
  birthDate: Date;
  isActive: boolean;
}

async function getUserByEmail(email: string): Promise<User | null> { }
```

### Nomes Técnicos (Inglês - Preservar Oficiais)
```typescript
// ✅ CORRETO - Nomes oficiais preservados
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
const jwt = require('jsonwebtoken');

// ❌ INCORRETO - Tradução desnecessária
import { ClientePrisma } from '@prisma/client';
import { Requisicao, Resposta } from 'express';
```

---

## Estrutura de Funções

### Tamanho e Complexidade
```typescript
// ✅ CORRETO - Função pequena, uma responsabilidade
async function calcularDesconto(pedido: Pedido, cupom: Cupom): Promise<number> {
  if (!cupom.ehValidoPara(pedido)) return 0;
  return cupom.aplicar(pedido.valorTotal);
}

// ❌ INCORRETO - Função grande, múltiplas responsabilidades
async function processarPedido(pedido: Pedido, cupom?: Cupom): Promise<PedidoProcessado> {
  // validação
  if (!pedido.itens.length) throw new Error('Pedido vazio');
  if (pedido.valorTotal <= 0) throw new Error('Valor inválido');
  
  // desconto
  let desconto = 0;
  if (cupom) {
    if (cupom.ehValidoPara(pedido)) {
      desconto = cupom.aplicar(pedido.valorTotal);
    }
  }
  
  // frete
  const frete = calcularFrete(pedido.endereco);
  
  // pagamento
  const pagamento = await processarPagamento(pedido.valorTotal - desconto + frete);
  
  // estoque
  await baixarEstoque(pedido.itens);
  
  // notificação
  await enviarEmailConfirmacao(pedido.cliente.email);
  
  return { pedido, desconto, frete, pagamento };
}
```

### Parâmetros
```typescript
// ✅ CORRETO - Objeto de opções para muitos parâmetros
interface ListarUsuariosOpcoes {
  pagina?: number;
  limite?: number;
  busca?: string;
  ordenarPor?: 'nome' | 'email' | 'criadoEm';
  ordem?: 'asc' | 'desc';
}

async function listarUsuarios(opcoes: ListarUsuariosOpcoes = {}): Promise<Paginado<Usuario>> {
  const { pagina = 1, limite = 20, busca = '', ordenarPor = 'criadoEm', ordem = 'desc' } = opcoes;
  // ...
}

// ❌ INCORRETO - Muitos parâmetros posicionais
async function listarUsuarios(
  pagina: number,
  limite: number,
  busca: string,
  ordenarPor: string,
  ordem: string
): Promise<Paginado<Usuario>> { }
```

### Retorno Explícito
```typescript
// ✅ CORRETO - Tipo de retorno explícito para API pública
async function obterUsuarioPorId(id: string): Promise<Usuario | null> {
  const usuario = await this.repository.encontrarPorId(id);
  return usuario ?? null;
}

// ✅ CORRETO - Inferência OK para funções privadas/simples
const formatarNome = (usuario: Usuario) => `${usuario.nome} (${usuario.email})`;
```

---

## TypeScript - Tipagem Rigorosa

### Configuração Recomendada (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Evitar `any`
```typescript
// ✅ CORRETO - Tipos específicos
function processarDados(dados: Usuario[]): Relatorio {
  return dados.map(u => ({ nome: u.nome, total: u.pedidos.length }));
}

// ✅ ACEITÁVEL - unknown + type guard quando tipo verdadeiramente desconhecido
function parsearJsonSeguro(json: string): unknown {
  return JSON.parse(json);
}

function ehUsuario(obj: unknown): obj is Usuario {
  return typeof obj === 'object' && obj !== null && 'email' in obj;
}

// ❌ INCORRETO - any desnecessário
function processar(dados: any): any {
  return dados.map((u: any) => u.nome);
}
```

### Tipos Utilitários
```typescript
// ✅ CORRETO - Usar utilitários nativos
type UsuarioSemSenha = Omit<Usuario, 'senha'>;
type UsuarioParcial = Partial<Usuario>;
type UsuarioObrigatorio = Required<Usuario>;
type ChavesUsuario = keyof Usuario;
type CriarUsuario = Pick<Usuario, 'nome' | 'email' | 'senha'>;

// ✅ CORRETO - Tipos condicionais para APIs
type ApiResponse<T> = 
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: ApiError };
```

---

## Classes e Injeção de Dependência

### Padrão Factory/Constructor Injection
```typescript
// ✅ CORRETO - Dependências injetadas no construtor
export class UsuariosService {
  constructor(
    private readonly repository: UsuariosRepository,
    private readonly hashService: HashService,
    private readonly eventPublisher: EventPublisher
  ) {}

  async criar(dados: CriarUsuarioDTO): Promise<UsuarioResponse> {
    // usa this.repository, this.hashService, this.eventPublisher
  }
}

// Factory para criação (opcional, para wiring)
export function criarUsuariosService(): UsuariosService {
  return new UsuariosService(
    new UsuariosRepository(prisma),
    new Argon2HashService(),
    new EventPublisher()
  );
}

// ❌ INCORRETO - Instanciação direta dentro da classe (acoplamento forte)
export class UsuariosService {
  private repository = new UsuariosRepository(); // Acoplado a implementação
  private hash = new BcryptHashService();        // Difícil testar/mockar
}
```

### Herança vs Composição
```typescript
// ✅ CORRETO - Composição (preferível)
class RelatorioUsuarios {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly pdfGenerator: PdfGenerator
  ) {}

  async gerar(): Promise<Buffer> {
    const usuarios = await this.usuariosService.listar({});
    return this.pdfGenerator.gerar(usuarios);
  }
}

// ⚠️ ACEITÁVEL - Herança só para compartilhar comportamento real
abstract class BaseRepository<T> {
  protected constructor(protected readonly prisma: PrismaClient) {}
  
  async encontrarPorId(id: string): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({ where: { id } });
  }
  
  protected abstract get modelName(): string;
}

class UsuariosRepository extends BaseRepository<Usuario> {
  protected get modelName() { return 'usuario'; }
}
```

---

## Tratamento de Erros

### Erros como Valores (Result Pattern)
```typescript
// ✅ CORRETO - Result type para operações que podem falhar
type Result<T, E = Error> = 
  | { ok: true; valor: T }
  | { ok: false; erro: E };

async function buscarUsuario(id: string): Promise<Result<Usuario, UsuarioNaoEncontradoError>> {
  const usuario = await repository.encontrarPorId(id);
  if (!usuario) {
    return { ok: false, erro: new UsuarioNaoEncontradoError(id) };
  }
  return { ok: true, valor: usuario };
}

// Uso
const resultado = await buscarUsuario(id);
if (!resultado.ok) {
  return res.status(404).json({ erro: resultado.erro.message });
}
// resultado.valor é Usuario tipado
```

### Exceptions para Casos Excepcionais
```typescript
// ✅ CORRETO - Exceptions para erros de programação/inesperados
class UsuarioNaoEncontradoError extends AppError {
  constructor(id: string) {
    super(`Usuário ${id} não encontrado`, 404, 'NAO_ENCONTRADO');
  }
}

// Middleware centralizado captura e converte para HTTP
// Nunca fazer try/catch em controller só para repassar
async function obterPorId(req: Request, res: Response, next: NextFunction) {
  const usuario = await service.obterPorId(req.params.id); // Lança se não achar
  res.json(usuario); // Se chegou aqui, usuario existe
}
```

### Nunca Ignorar Erros
```typescript
// ✅ CORRETO - Tratar ou propagar
try {
  await emailService.enviarBoasVindas(usuario.email);
} catch (erro) {
  logger.warn('Falha ao enviar email boas-vindas', { erro, usuarioId: usuario.id });
  // Não falhar a criação do usuário por causa do email
}

// ❌ INCORRETO - Catch vazio
try {
  await emailService.enviarBoasVindas(usuario.email);
} catch { } // Silenciosamente ignorado!

// ❌ INCORRETO - Console.log em produção
try {
  await emailService.enviarBoasVindas(usuario.email);
} catch (erro) {
  console.log('Erro:', erro); // Não é logging estruturado
}
```

---

## Validação de Entrada

### Zod Schemas (Recomendado)
```typescript
// ✅ CORRETO - Schema explícito, reutilizável
const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100),
    email: z.string().email(),
    senha: z.string().min(8).max(128),
    dataNascimento: z.string().date().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Middleware genérico valida req.body, req.params, req.query
router.post('/', validar(criarUsuarioSchema), controller.criar);

// ❌ INCORRETO - Validação manual inline
async function criar(req: Request, res: Response) {
  if (!req.body.nome || req.body.nome.length < 2) {
    return res.status(400).json({ erro: 'Nome inválido' });
  }
  if (!req.body.email || !req.body.email.includes('@')) {
    return res.status(400).json({ erro: 'Email inválido' });
  }
  // ... repetitivo, propenso a erros
}
```

---

## Componentes React

### Estrutura de Componente
```tsx
// ✅ CORRETO - Componente funcional, props tipadas, responsabilidade única
interface UsuarioCardProps {
  usuario: UsuarioResponse;
  aoClicar?: (id: string) => void;
  variante?: 'completo' | 'resumido';
}

export function UsuarioCard({ usuario, aoClicar, variante = 'completo' }: UsuarioCardProps) {
  const formatarData = useCallback((data: string) => 
    new Date(data).toLocaleDateString('pt-BR'), []);
  
  return (
    <article className={cn('card', variante === 'resumido' && 'card-resumido')}>
      <header>
        <h3>{usuario.nome}</h3>
        <span className="badge">{usuario.roles.join(', ')}</span>
      </header>
      {variante === 'completo' && (
        <div className="detalhes">
          <p>{usuario.email}</p>
          <time dateTime={usuario.criadoEm}>Criado em {formatarData(usuario.criadoEm)}</time>
        </div>
      )}
      {aoClicar && (
        <Button onClick={() => aoClicar(usuario.id)} variant="ghost">
          Ver detalhes
        </Button>
      )}
    </article>
  );
}

UsuarioCard.displayName = 'UsuarioCard';
```

### Hooks Personalizados
```typescript
// ✅ CORRETO - Hook encapsula lógica de estado/efeito
function useUsuarios(filtros: FiltrosUsuarios = {}) {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['usuarios', filtros],
    queryFn: () => usuariosApi.listar(filtros),
    placeholderData: (previous) => previous,
  });
  
  const criarMutation = useMutation({
    mutationFn: usuariosApi.criar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });
  
  return {
    usuarios: data?.dados ?? [],
    paginacao: data?.paginacao,
    isLoading,
    error,
    refetch,
    criar: criarMutation.mutateAsync,
    isCriando: criarMutation.isPending,
  };
}
```

---

## Padrões de Arquivo

### Ordem de Imports
```typescript
// 1. Imports de biblioteca (externos)
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// 2. Imports absolutos do projeto (@/ alias)
import { AppError } from '@/errors/AppError';
import { HTTP_STATUS } from '@/utils/http-status';
import { cn } from '@/utils/cn';

// 3. Imports relativos (mesmo diretório ou subdiretórios)
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { HashService } from '../services/hash.service';
import { criarUsuarioSchema } from '../validations/usuarios.validation';

// 4. Types (se necessário separar)
import type { Usuario, CriarUsuarioDTO } from '../types/usuario.types';
```

### Exports
```typescript
// ✅ CORRETO - Named exports (tree-shaking, refactoring)
export class UsuariosService { }
export class UsuariosController { }
export const usuariosRouter = router;

// ❌ EVITAR - Default export para classes/funções principais
export default class UsuariosService { } // Dificulta renomeação/refactoring
```

---

## Comentários

### Quando Comentar
```typescript
// ✅ CORRETO - Por quê (decisão, trade-off, regra de negócio complexa)
/**
 * Calcula frete usando tabela Correios.
 * Regra de negócio: frete grátis para pedidos > R$ 299,90
 * exceto para regiões Norte/Nordeste onde o mínimo é R$ 399,90.
 * 
 * @see https://github.com/empresa/regras-negocio/blob/main/frete.md
 */
function calcularFrete(endereco: Endereco, valorTotal: number): number {
  const ehRegiaoNorteNordeste = ['N', 'NE'].includes(endereco.regiao);
  const minimoGratis = ehRegiaoNorteNordeste ? 399.90 : 299.90;
  
  if (valorTotal >= minimoGratis) return 0;
  
  return tabelaCorreios.calcular(endereco.cep, valorTotal);
}

// ✅ CORRETO - Algoritmo complexo
// Busca binária em array ordenado de intervalos de CEP
// O(log n) vs O(n) linear - crítico para performance em 100k+ CEPs
function buscarFaixaCep(cep: string): FaixaCep | null { }

// ❌ INCORRETO - Comentário óbvio (repete o código)
// Incrementa contador
contador++;

// Loop pelos usuários
for (const usuario of usuarios) { }

// ❌ INCORRETO - Comentário desatualizado/mentiroso
// Retorna usuário por ID (na verdade retorna por email)
async function buscarPorEmail(email: string) { }
```

### JSDoc para API Pública
```typescript
/**
 * Cria um novo usuário no sistema.
 * 
 * @param dados - Dados do usuário (nome, email, senha)
 * @returns Usuário criado (sem senha)
 * @throws {EmailJaCadastradoError} Se email já existir
 * @throws {ValidacaoError} Se dados inválidos
 * 
 * @example
 * const usuario = await usuariosService.criar({
 *   nome: 'João Silva',
 *   email: 'joao@email.com',
 *   senha: 'senhaSegura123'
 * });
 */
async function criar(dados: CriarUsuarioDTO): Promise<UsuarioResponse> { }
```

---

## Anti-Padrões a Evitar

| Anti-Padrão | Problema | Solução |
|-------------|----------|---------|
| **God Class/Function** | Uma classe/função faz tudo | Dividir em classes/funções pequenas (SRP) |
| **Callback Hell** | Múltiplos níveis de callbacks | `async/await`, Promise chains |
| **Primitive Obsession** | Usar `string` para email, CPF, CEP | Value Objects / Branded Types |
| **Data Clumps** | Mesmos 3-4 parâmetros sempre juntos | Agrupar em objeto/DTO |
| **Shotgun Surgery** | Mudança exige editar muitos arquivos | Coesão: agrupar o que muda junto |
| **Feature Envy** | Método usa mais dados de outra classe | Mover método para a classe dona dos dados |
| **Magic Numbers** | Números hardcoded sem explicação | Constantes nomeadas |
| **Dead Code** | Código não usado, imports não usados | Remover; Git guarda histórico |
| **Console.log em Prod** | Vaza info, polui logs | Structured logger (pino, winston) |
| **Type Assertion Abuso** | `as Tipo` para calar TypeScript | Corrigir o tipo real; `unknown` + guard |

---

## Refatoração Segura

### Checklist Antes de Refatorar
- [ ] Testes existentes passam (cobertura adequada)
- [ ] Entender o comportamento atual completamente
- [ ] Fazer uma mudança por vez
- [ ] Rodar testes após cada mudança
- [ ] Commit a cada passo verde
- [ ] Não refatorar + adicionar feature no mesmo PR

### Exemplo: Extrair Método
```typescript
// ANTES
async function processarPedido(pedido: Pedido) {
  // validação
  if (!pedido.itens.length) throw new Error('Vazio');
  if (pedido.valorTotal <= 0) throw new Error('Inválido');
  
  // desconto
  let desconto = 0;
  if (pedido.cupom?.ehValidoPara(pedido)) {
    desconto = pedido.cupom.aplicar(pedido.valorTotal);
  }
  
  // ... resto
}

// DEPOIS - Passo a passo
async function processarPedido(pedido: Pedido) {
  validarPedido(pedido);           // Extração 1
  const desconto = calcularDesconto(pedido); // Extração 2
  // ...
}

function validarPedido(pedido: Pedido): void {
  if (!pedido.itens.length) throw new Error('Vazio');
  if (pedido.valorTotal <= 0) throw new Error('Inválido');
}

function calcularDesconto(pedido: Pedido): number {
  if (!pedido.cupom?.ehValidoPara(pedido)) return 0;
  return pedido.cupom.aplicar(pedido.valorTotal);
}
```

---

## Revisão de Código (Code Review)

### Checklist Rápido
- [ ] **Funciona?** Atende requisitos? Testes passam?
- [ ] **Legível?** Nomes claros? Funções pequenas? Comentários úteis?
- [ ] **Seguro?** Validação entrada? AuthZ? Sem segredos? Sem SQL injection?
- [ ] **Performance?** Queries N+1? Loops desnecessários? Bundle size?
- [ ] **Testável?** Dependências injetadas? Sem side effects ocultos?
- [ ] **Consistente?** Segue padrões do projeto? Nomenclatura? Estrutura?
- [ ] **Documentado?** Tipos públicos têm JSDoc? Decisões registradas?

---

## Ferramentas de Qualidade

```json
// package.json scripts recomendados
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "validate": "npm run lint && npm run typecheck && npm run test && npm run format:check"
  }
}
```

### ESLint Recomendado (`.eslintrc.json`)
```json
{
  "root": true,
  "env": { "node": true, "es2022": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json",
    "tsconfigRootDir": "."
  },
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "warn",
    "import/order": ["error", { "groups": ["builtin", "external", "internal", "parent", "sibling", "index"] }],
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## Referências Cruzadas

- `docs/ARQUITETURA.md` - Arquitetura onde estas regras se aplicam
- `docs/SEGURANCA.md` - Regras de segurança complementares
- `docs/TESTES.md` - Testabilidade como critério de código limpo
- `templates/` - Templates já aplicam estas convenções
- `exemplos/arquitetura-modular/` - Implementação de referência