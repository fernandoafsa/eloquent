export interface EloquentMethod {
  id: string;
  name: string;
  category: 'retrieval' | 'filtering' | 'persistence' | 'relations' | 'performance';
  shortDescription: string;
  explanation: string;
  params: {
    name: string;
    label: string;
    type: 'select' | 'number' | 'text' | 'boolean';
    options?: { value: string; label: string }[];
    defaultValue: string | number | boolean;
    min?: number;
    max?: number;
  }[];
  controllerExample: (params: Record<string, string | number | boolean>) => string;
  livewireExample: (params: Record<string, string | number | boolean>) => string;
  livewireViewExample?: (params: Record<string, string | number | boolean>) => string;
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'editor' | 'user';
  created_at: string;
}

export interface PostRow {
  id: number;
  user_id: number;
  title: string;
  status: 'published' | 'draft';
  likes: number;
}

export const MOCK_USERS: UserRow[] = [
  { id: 1, name: 'Carlos Gómez', email: 'carlos@example.com', status: 'active', role: 'admin', created_at: '2026-01-15' },
  { id: 2, name: 'Ana Martínez', email: 'ana@example.com', status: 'active', role: 'editor', created_at: '2026-02-20' },
  { id: 3, name: 'Lucas Díaz', email: 'lucas@example.com', status: 'inactive', role: 'user', created_at: '2026-03-05' },
  { id: 4, name: 'Sofía Castro', email: 'sofia@example.com', status: 'active', role: 'user', created_at: '2026-04-12' },
  { id: 5, name: 'Diego Ruiz', email: 'diego@example.com', status: 'inactive', role: 'user', created_at: '2026-05-18' }
];

export const MOCK_POSTS: PostRow[] = [
  { id: 1, user_id: 1, title: 'Introducción a Laravel 11', status: 'published', likes: 45 },
  { id: 2, user_id: 1, title: 'Tips avanzados de Eloquent', status: 'published', likes: 120 },
  { id: 3, user_id: 2, title: 'Componentes reactivos en Livewire', status: 'published', likes: 85 },
  { id: 4, user_id: 3, title: 'Pruebas unitarias en PHP', status: 'draft', likes: 0 },
  { id: 5, user_id: 4, title: 'Desplegando en Vercel', status: 'published', likes: 30 }
];

export const CATEGORIES = [
  { id: 'retrieval', name: 'Recuperación Básica' },
  { id: 'filtering', name: 'Filtrado y Consultas' },
  { id: 'persistence', name: 'Persistencia y Creación' },
  { id: 'relations', name: 'Relaciones y Eager Loading' },
  { id: 'performance', name: 'Rendimiento y Volumen' }
];

export const ELOQUENT_METHODS: EloquentMethod[] = [
  {
    id: 'find',
    name: 'find() / findOrFail()',
    category: 'retrieval',
    shortDescription: 'Busca un modelo por su clave primaria (generalmente ID).',
    explanation: 'El método find($id) busca un registro por su ID de forma rápida. Retorna una única instancia del modelo o null si no se encuentra. Su alternativa findOrFail($id) lanza una excepción ModelNotFoundException en caso de fallar, lo que permite a Laravel retornar automáticamente una respuesta 404.',
    params: [
      {
        name: 'id',
        label: 'ID del Usuario',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 8
      },
      {
        name: 'fail',
        label: 'Usar findOrFail()',
        type: 'boolean',
        defaultValue: false
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Muestra el perfil del usuario solicitado.
     */
    public function show($id)
    {
        // Recupera el modelo usando ${p.fail ? 'findOrFail' : 'find'}
        $user = User::${p.fail ? `findOrFail(${p.id})` : `find(${p.id})`};

        // ${p.fail ? 'Si no existe, se lanza automáticamente un error 404.' : 'Verifica si se encontró el registro.'}
        ${p.fail ? '' : `if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }`}

        return view('users.show', compact('user'));
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;
use Illuminate\\Database\\Eloquent\\ModelNotFoundException;

class UserProfile extends Component
{
    public $userId;

    public function mount($userId)
    {
        $this->userId = $userId;
    }

    /**
     * Propiedad computada reactiva.
     */
    public function getUserProperty()
    {
        try {
            return User::${p.fail ? `findOrFail($this->userId)` : `find($this->userId)`};
        } catch (ModelNotFoundException $e) {
            return null;
        }
    }

    public function render()
    {
        return view('livewire.user-profile', [
            'user' => $this->user
        ]);
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/user-profile.blade.php -->
<div class="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
    @if($user)
        <h2 class="text-xl font-bold text-white">{{ $user->name }}</h2>
        <p class="text-slate-400">Email: {{ $user->email }}</p>
        <span class="px-2 py-1 text-xs rounded bg-indigo-500/20 text-indigo-400">
            Rol: {{ ucfirst($user->role) }}
        </span>
    @else
        <div class="text-red-400 font-semibold flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Usuario no encontrado
        </div>
    @endif
</div>`
  },
  {
    id: 'where',
    name: 'where()',
    category: 'filtering',
    shortDescription: 'Añade cláusulas "where" de tipo clave/valor para filtrar resultados.',
    explanation: 'El método where() agrega una condición a la consulta SQL. Puede recibir dos parámetros (columna, valor) asumiendo la igualdad, o tres parámetros (columna, operador, valor) para filtros avanzados. Al final de la cadena de consulta, debes llamar a un terminador como ->get() (para obtener una colección de resultados), ->first() (para el primer registro) o ->count().',
    params: [
      {
        name: 'column',
        label: 'Columna',
        type: 'select',
        options: [
          { value: 'status', label: 'status' },
          { value: 'role', label: 'role' },
          { value: 'id', label: 'id' }
        ],
        defaultValue: 'status'
      },
      {
        name: 'operator',
        label: 'Operador',
        type: 'select',
        options: [
          { value: '=', label: '=' },
          { value: '!=', label: '!=' },
          { value: '>', label: '>' },
          { value: 'like', label: 'like' }
        ],
        defaultValue: '='
      },
      {
        name: 'value',
        label: 'Valor',
        type: 'text',
        defaultValue: 'active'
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserDirectoryController extends Controller
{
    public function index(Request $request)
    {
        // Filtra usuarios dinámicamente con where
        $users = User::where('${p.column}', '${p.operator}', '${p.value}')->get();

        return view('users.index', compact('users'));
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class UserDirectory extends Component
{
    public $searchVal = '${p.value}';
    
    // Escucha eventos o actualiza propiedades de forma reactiva
    public function render()
    {
        $users = User::where('${p.column}', '${p.operator}', $this->searchVal)->get();

        return view('livewire.user-directory', [
            'users' => $users
        ]);
    }
}`,
    livewireViewExample: (p) => `<!-- livewire/user-directory.blade.php -->
<div class="space-y-4">
    <div class="flex gap-2">
        <input type="text" wire:model.live="searchVal" class="bg-slate-800 text-white rounded p-2" />
        <span class="text-slate-400 self-center">Filtro activo: ${p.column} ${p.operator} {{ $searchVal }}</span>
    </div>

    <ul class="divide-y divide-slate-700">
        @forelse($users as $user)
            <li class="py-2 text-white">{{ $user->name }} - <span class="text-slate-400">{{ $user->email }}</span></li>
        @empty
            <li class="py-2 text-yellow-500 font-semibold">Ningún usuario coincide con los criterios.</li>
        @endforelse
    </ul>
</div>`
  },
  {
    id: 'firstOrCreate',
    name: 'firstOrCreate()',
    category: 'persistence',
    shortDescription: 'Busca el primer registro coincidente o lo crea si no existe.',
    explanation: 'Excelente para evitar duplicados en procesos automáticos. Recibe dos arrays: el primero contiene las condiciones de búsqueda y el segundo contiene los campos adicionales de creación que solo se aplicarán si el registro no se encuentra.',
    params: [
      {
        name: 'email',
        label: 'Email a buscar',
        type: 'text',
        defaultValue: 'carlos@example.com'
      },
      {
        name: 'name',
        label: 'Nombre (si se crea)',
        type: 'text',
        defaultValue: 'Nuevo Usuario'
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthIntegrationController extends Controller
{
    public function handleSocialLogin(Request $request)
    {
        // Busca usuario por email, si no existe lo crea con el nombre especificado
        $user = User::firstOrCreate(
            ['email' => '${p.email}'],
            [
                'name' => '${p.name}',
                'role' => 'user',
                'status' => 'active'
            ]
        );

        // Se loguea al usuario retornado
        auth()->login($user);

        return redirect('/dashboard');
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class QuickRegister extends Component
{
    public $email = '${p.email}';
    public $name = '${p.name}';
    public $message = '';

    public function register()
    {
        $user = User::firstOrCreate(
            ['email' => $this->email],
            [
                'name' => $this->name,
                'role' => 'user',
                'status' => 'active'
            ]
        );

        if ($user->wasRecentlyCreated) {
            $this->message = "¡Usuario creado exitosamente!";
        } else {
            $this->message = "El usuario ya existía. Iniciando sesión.";
        }
    }

    public function render()
    {
        return view('livewire.quick-register');
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/quick-register.blade.php -->
<div class="space-y-4">
    <div class="flex flex-col gap-2">
        <input type="text" wire:model="name" placeholder="Nombre" class="bg-slate-800 text-white rounded p-2" />
        <input type="email" wire:model="email" placeholder="Email" class="bg-slate-800 text-white rounded p-2" />
        <button wire:click="register" class="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition">
            Registrar o Buscar
        </button>
    </div>

    @if($message)
        <div class="p-3 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
            {{ $message }}
        </div>
    @endif
</div>`
  },
  {
    id: 'updateOrCreate',
    name: 'updateOrCreate()',
    category: 'persistence',
    shortDescription: 'Actualiza un registro existente o crea uno nuevo según ciertos criterios.',
    explanation: 'Busca un registro utilizando los atributos pasados en el primer parámetro. Si se encuentra, actualiza el registro con los atributos del segundo parámetro. Si no se encuentra, inserta un registro combinando los dos arrays de atributos.',
    params: [
      {
        name: 'email',
        label: 'Email a buscar',
        type: 'text',
        defaultValue: 'carlos@example.com'
      },
      {
        name: 'status',
        label: 'Nuevo Status',
        type: 'select',
        options: [
          { value: 'active', label: 'active' },
          { value: 'inactive', label: 'inactive' }
        ],
        defaultValue: 'inactive'
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserSyncController extends Controller
{
    public function syncUser(Request $request)
    {
        // Si el usuario existe actualiza su status, si no existe lo crea con ese status
        $user = User::updateOrCreate(
            ['email' => '${p.email}'],
            [
                'status' => '${p.status}',
                'name' => 'Usuario Sincronizado',
                'role' => 'user'
            ]
        );

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'action' => $user->wasRecentlyCreated ? 'created' : 'updated'
        ]);
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class UserStatusToggler extends Component
{
    public $email = '${p.email}';
    public $status = '${p.status}';
    public $syncStatus = '';

    public function toggleOrSync()
    {
        $user = User::updateOrCreate(
            ['email' => $this->email],
            [
                'status' => $this->status,
                'name' => 'Usuario Sincronizado',
                'role' => 'user'
            ]
        );

        $action = $user->wasRecentlyCreated ? 'creado nuevo' : 'actualizado existente';
        $this->syncStatus = "Usuario con email {$this->email} ha sido {$action}.";
    }

    public function render()
    {
        return view('livewire.user-status-toggler');
    }
}`,
    livewireViewExample: (p) => `<!-- livewire/user-status-toggler.blade.php -->
<div class="p-4 bg-slate-800 rounded-lg">
    <div class="flex items-center gap-3">
        <span class="text-white">Actualizar ${p.email} a:</span>
        <button wire:click="toggleOrSync" class="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-1 rounded">
            Sincronizar como: ${p.status}
        </button>
    </div>
    @if($syncStatus)
        <p class="mt-3 text-emerald-400 font-semibold">{{ $syncStatus }}</p>
    @endif
</div>`
  },
  {
    id: 'with',
    name: 'with() (Eager Loading)',
    category: 'relations',
    shortDescription: 'Carga relaciones de forma ambiciosa para solucionar el problema N+1.',
    explanation: 'El problema N+1 ocurre cuando cargas una lista de modelos (ej. 5 usuarios) y luego accedes a su relación en un bucle (ej. sus posts). Eloquent por defecto ejecutará 1 consulta para los usuarios y luego 1 consulta para obtener los posts de CADA usuario, sumando 6 consultas (1+5). Usando with() o Eager Loading, Eloquent junta todos los IDs de los usuarios y ejecuta solo una segunda consulta: SELECT * FROM posts WHERE user_id IN (1,2,3,4,5), logrando el mismo resultado en exactamente 2 consultas totales sin importar el volumen de datos.',
    params: [
      {
        name: 'eager',
        label: 'Activar Eager Loading (optimizado)',
        type: 'boolean',
        defaultValue: true
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class BlogDashboardController extends Controller
{
    public function index()
    {
        // ${p.eager ? 'EAGER LOADING: 2 queries en total (usuarios y posts)' : 'LAZY LOADING (N+1): Ejecutará 1 query para usuarios y 1 query para posts por cada usuario en la vista'}
        $users = User::${p.eager ? "with('posts')->" : ''}get();

        return view('blog.dashboard', compact('users'));
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class AuthorPostsList extends Component
{
    public $eager = ${p.eager ? 'true' : 'false'};

    public function render()
    {
        // La vista de Livewire renderizará a cada usuario y sus posts
        $query = User::query();
        
        if ($this->eager) {
            $query->with('posts');
        }

        return view('livewire.author-posts-list', [
            'users' => $query->get()
        ]);
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/author-posts-list.blade.php -->
<div class="space-y-4">
    <div class="text-xs text-slate-400">
        Eager Loading está: 
        <span class="{{ $eager ? 'text-emerald-400' : 'text-rose-400' }} font-bold">
            {{ $eager ? 'ACTIVO (2 Consultas)' : 'INACTIVO (N+1 Consultas)' }}
        </span>
    </div>

    @foreach($users as $user)
        <div class="border-b border-slate-700 pb-2">
            <h3 class="font-bold text-white">{{ $user->name }}</h3>
            <!-- Ojo: aquí se accede a la relación de forma dinámica -->
            <ul class="pl-4 list-disc text-sm text-slate-300">
                @forelse($user->posts as $post)
                    <li>{{ $post->title }} ({{ $post->status }})</li>
                @empty
                    <li class="text-slate-500 list-none">Sin posts redactados</li>
                @endforelse
            </ul>
        </div>
    @endforeach
</div>`
  },
  {
    id: 'whereHas',
    name: 'whereHas()',
    category: 'relations',
    shortDescription: 'Filtra modelos consultando la existencia o atributos de sus relaciones.',
    explanation: 'Sirve para filtrar modelos basados en las características de sus tablas hijas. Por ejemplo, recuperar solo a los usuarios que tengan publicaciones (posts) que coincidan con un filtro determinado, como tener más de cierta cantidad de Likes o que tengan estatus de borrador o publicado.',
    params: [
      {
        name: 'relation',
        label: 'Relación',
        type: 'select',
        options: [{ value: 'posts', label: 'posts' }],
        defaultValue: 'posts'
      },
      {
        name: 'minLikes',
        label: 'Mínimo de Likes',
        type: 'number',
        defaultValue: 50,
        min: 0,
        max: 200
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;

class MarketingCampaignController extends Controller
{
    public function getInfluentialAuthors()
    {
        // Filtra usuarios que tienen al menos un post con más de ${p.minLikes} likes
        $popularAuthors = User::whereHas('posts', function ($query) {
            $query->where('likes', '>=', ${p.minLikes});
        })->get();

        return view('marketing.authors', compact('popularAuthors'));
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class PopularAuthors extends Component
{
    public $minLikes = ${p.minLikes};

    public function render()
    {
        $authors = User::whereHas('posts', function ($query) {
            $query->where('likes', '>=', $this->minLikes);
        })->get();

        return view('livewire.popular-authors', [
            'authors' => $authors
        ]);
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/popular-authors.blade.php -->
<div>
    <h3 class="text-lg font-bold text-white mb-2">Autores Populares (Likes >= {{ $minLikes }})</h3>
    <ul class="space-y-1">
        @forelse($authors as $author)
            <li class="text-emerald-400 font-semibold">• {{ $author->name }}</li>
        @empty
            <li class="text-slate-500">Ningún autor supera el límite de likes configurado.</li>
        @endforelse
    </ul>
</div>`
  },
  {
    id: 'paginate',
    name: 'paginate()',
    category: 'performance',
    shortDescription: 'Crea automáticamente un paginador con enlaces de navegación y metadatos.',
    explanation: 'El paginador de Laravel ejecuta dos consultas a la base de datos automáticamente: una para contar el total de registros en la base de datos (necesaria para saber cuántas páginas hay en total) y otra usando LIMIT y OFFSET para traer exclusivamente los registros de la página seleccionada. Retorna una instancia de LengthAwarePaginator que incluye los métodos para renderizar los enlaces HTML automáticamente en las vistas de Blade.',
    params: [
      {
        name: 'perPage',
        label: 'Registros por Página',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 5
      },
      {
        name: 'page',
        label: 'Página seleccionada',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 5
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserPaginationController extends Controller
{
    public function index(Request $request)
    {
        // Genera la paginación con ${p.perPage} registros por página.
        // Laravel lee el parámetro ?page=${p.page} de la URL automáticamente.
        $users = User::paginate(${p.perPage});

        return view('users.pagination', compact('users'));
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\User;

class PaginatedUsers extends Component
{
    use WithPagination; // Habilita la paginación en Livewire sin refrescar la página

    protected $paginationTheme = 'tailwind'; // Usa el estilo de tailwind para los botones

    public $perPage = ${p.perPage};

    public function render()
    {
        // Trae los datos de la página actual
        return view('livewire.paginated-users', [
            'users' => User::paginate($this->perPage)
        ]);
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/paginated-users.blade.php -->
<div class="space-y-4">
    <div class="bg-slate-800 p-4 rounded-lg">
        @foreach($users as $user)
            <div class="py-2 border-b border-slate-700 text-white">
                {{ $user->name }} ({{ $user->email }})
            </div>
        @endforeach
    </div>

    <!-- Renderiza los enlaces de paginación automáticamente -->
    <div class="mt-4">
        {{ $users->links() }}
    </div>
</div>`
  },
  {
    id: 'chunk',
    name: 'chunk() vs cursor()',
    category: 'performance',
    shortDescription: 'Optimiza el procesamiento de grandes volúmenes de datos reduciendo la carga de memoria.',
    explanation: 'Cuando procesas miles de registros (ej. enviar correos o regenerar reportes), cargarlos todos a la vez usando ->get() consume muchísima memoria RAM, lo que puede tumbar el servidor (Out of Memory). \n\n' +
      '• chunk($n, callback) divide la base de datos en bloques de tamaño $n. Ejecuta múltiples consultas con LIMIT y OFFSET consecutivas, cargando a memoria solo los $n registros del bloque actual a la vez.\n' +
      '• cursor() realiza una sola consulta SQL, pero utiliza generadores PHP (lazy collections / yield) para instanciar solo un objeto de modelo en la memoria a la vez a medida que iteras el bucle foreach, reduciendo el consumo de memoria al mínimo absoluto.',
    params: [
      {
        name: 'methodType',
        label: 'Tipo de método',
        type: 'select',
        options: [
          { value: 'chunk', label: 'chunk(2, callback) - Bloques' },
          { value: 'cursor', label: 'cursor() - Generadores' }
        ],
        defaultValue: 'chunk'
      }
    ],
    controllerExample: (p) => `<?php

namespace App\Http\Controllers;

use App\Models\User;

class HeavyProcessingController extends Controller
{
    public function processUsers()
    {
        ${p.methodType === 'chunk' 
          ? `// CHUNK: Divide la lectura en lotes de 2 usuarios
        // Mantiene la memoria RAM controlada
        User::chunk(2, function ($users) {
            foreach ($users as $user) {
                // Procesa usuario sin llenar la memoria
                $this->sendNewsletter($user);
            }
        });`
          : `// CURSOR: Ejecuta 1 consulta sql, pero utiliza generadores
        // Solo mantiene en memoria 1 usuario a la vez durante el bucle
        foreach (User::cursor() as $user) {
            // Procesa usuario de forma secuencial y ultra-ligera
            $this->sendNewsletter($user);
        }`
        }

        return "Procesamiento completado con éxito";
    }

    private function sendNewsletter($user) {
        // Lógica de correo
    }
}`,
    livewireExample: (p) => `<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;

class UserHeavyProcessor extends Component
{
    public $processedCount = 0;
    public $method = '${p.methodType}';

    public function runProcess()
    {
        $this->processedCount = 0;

        if ($this->method === 'chunk') {
            User::chunk(2, function ($users) {
                foreach ($users as $user) {
                    // Simular procesamiento
                    $this->processedCount++;
                }
            });
        } else {
            foreach (User::cursor() as $user) {
                $this->processedCount++;
            }
        }
    }

    public function render()
    {
        return view('livewire.user-heavy-processor');
    }
}`,
    livewireViewExample: (_p) => `<!-- livewire/user-heavy-processor.blade.php -->
<div class="p-4 bg-slate-800 rounded-lg">
    <p class="text-white mb-2">Método activo: <span class="font-mono text-indigo-400">{{ $method }}()</span></p>
    <button wire:click="runProcess" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition">
        Iniciar Procesamiento Pesado
    </button>
    @if($processedCount > 0)
        <p class="mt-3 text-emerald-400">¡Se procesaron {{ $processedCount }} usuarios manteniendo la memoria controlada!</p>
    @endif
</div>`
  }
];

export interface SimulationResult {
  sql: string[];
  matchedUserIds: number[];
  matchedPostIds: number[];
  insertedUser?: UserRow;
  updatedUser?: UserRow;
  resultJson: string;
  stats: {
    queriesCount: number;
    durationMs: number;
    memoryMb: number;
  };
  querySteps: {
    title: string;
    sql: string;
    purpose: string;
  }[];
}

export function runSimulation(methodId: string, params: Record<string, string | number | boolean>): SimulationResult {
  const sql: string[] = [];
  let matchedUserIds: number[] = [];
  let matchedPostIds: number[] = [];
  let resultJson = '';
  let insertedUser: UserRow | undefined;
  let updatedUser: UserRow | undefined;
  let queriesCount = 0;
  let durationMs = 0;
  let memoryMb = 0;
  const querySteps: { title: string; sql: string; purpose: string }[] = [];

  switch (methodId) {
    case 'find': {
      const id = Number(params.id);
      const fail = !!params.fail;
      const user = MOCK_USERS.find(u => u.id === id);

      sql.push(`SELECT * FROM users WHERE id = ${id} LIMIT 1;`);
      queriesCount = 1;
      querySteps.push({
        title: fail ? 'findOrFail()' : 'find()',
        sql: `SELECT * FROM users WHERE id = ${id} LIMIT 1;`,
        purpose: 'Busca el registro por su clave primaria'
      });

      if (user) {
        matchedUserIds = [id];
        resultJson = JSON.stringify(user, null, 2);
        durationMs = 2.4;
        memoryMb = 0.8;
      } else {
        if (fail) {
          resultJson = 'Illuminate\\Database\\Eloquent\\ModelNotFoundException\nNo query results for model [App\\Models\\User] ' + id;
          durationMs = 4.1;
          memoryMb = 1.2;
        } else {
          resultJson = 'null';
          durationMs = 1.8;
          memoryMb = 0.7;
        }
      }
      break;
    }

    case 'where': {
      const column = String(params.column || 'status');
      const operator = String(params.operator || '=');
      const val = String(params.value || 'active');

      sql.push(`SELECT * FROM users WHERE ${column} ${operator} '${val}';`);
      queriesCount = 1;
      querySteps.push({
        title: 'where() -> get()',
        sql: `SELECT * FROM users WHERE ${column} ${operator} '${val}';`,
        purpose: 'Filtra y obtiene todos los registros coincidentes'
      });

      let filtered: UserRow[] = [];
      try {
        filtered = MOCK_USERS.filter((u) => {
          const uVal = u[column as keyof UserRow];
          if (operator === '=') return String(uVal).toLowerCase() === val.toLowerCase();
          if (operator === '!=') return String(uVal).toLowerCase() !== val.toLowerCase();
          if (operator === '>') return Number(uVal) > Number(val);
          if (operator === '<') return Number(uVal) < Number(val);
          if (operator === 'like') return String(uVal).toLowerCase().includes(val.toLowerCase().replace(/%/g, ''));
          return false;
        });
      } catch {
        filtered = [];
      }

      matchedUserIds = filtered.map(u => u.id);
      resultJson = JSON.stringify(filtered, null, 2);
      durationMs = 3.2;
      memoryMb = 1.1;
      break;
    }

    case 'firstOrCreate': {
      const email = String(params.email || '');
      const name = String(params.name || 'Nuevo Usuario');
      const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      sql.push(`SELECT * FROM users WHERE email = '${email}' LIMIT 1;`);
      queriesCount = 1;
      querySteps.push({
        title: 'Búsqueda Inicial',
        sql: `SELECT * FROM users WHERE email = '${email}' LIMIT 1;`,
        purpose: 'Comprueba si ya existe un usuario con ese email'
      });

      if (existing) {
        matchedUserIds = [existing.id];
        resultJson = JSON.stringify(existing, null, 2);
        durationMs = 2.1;
        memoryMb = 0.8;
      } else {
        queriesCount = 2;
        const newId = MOCK_USERS.length + 1;
        insertedUser = {
          id: newId,
          name,
          email,
          status: 'active',
          role: 'user',
          created_at: new Date().toISOString().split('T')[0]
        };
        sql.push(`INSERT INTO users (name, email, status, role, created_at) VALUES ('${name}', '${email}', 'active', 'user', '${insertedUser.created_at}');`);
        querySteps.push({
          title: 'Inserción del Registro',
          sql: `INSERT INTO users (name, email, status, role, created_at) VALUES ('${name}', '${email}', 'active', 'user', '${insertedUser.created_at}');`,
          purpose: 'Inserta el nuevo usuario ya que la consulta de búsqueda inicial no arrojó resultados'
        });
        resultJson = JSON.stringify(insertedUser, null, 2);
        durationMs = 8.5;
        memoryMb = 1.4;
      }
      break;
    }

    case 'updateOrCreate': {
      const email = String(params.email || '');
      const status = String(params.status || 'inactive') as 'active' | 'inactive';
      const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      sql.push(`SELECT * FROM users WHERE email = '${email}' LIMIT 1;`);
      queriesCount = 1;
      querySteps.push({
        title: 'Búsqueda Inicial',
        sql: `SELECT * FROM users WHERE email = '${email}' LIMIT 1;`,
        purpose: 'Busca el registro por el atributo único especificado'
      });

      if (existing) {
        queriesCount = 2;
        updatedUser = { ...existing, status };
        sql.push(`UPDATE users SET status = '${status}' WHERE id = ${existing.id};`);
        querySteps.push({
          title: 'Actualización del Registro',
          sql: `UPDATE users SET status = '${status}' WHERE id = ${existing.id};`,
          purpose: 'Actualiza los campos del segundo parámetro en el registro encontrado'
        });
        matchedUserIds = [existing.id];
        resultJson = JSON.stringify(updatedUser, null, 2);
        durationMs = 7.2;
        memoryMb = 1.2;
      } else {
        queriesCount = 2;
        const newId = MOCK_USERS.length + 1;
        insertedUser = {
          id: newId,
          name: 'Usuario Sincronizado',
          email,
          status,
          role: 'user',
          created_at: new Date().toISOString().split('T')[0]
        };
        sql.push(`INSERT INTO users (name, email, status, role, created_at) VALUES ('Usuario Sincronizado', '${email}', '${status}', 'user', '${insertedUser.created_at}');`);
        querySteps.push({
          title: 'Inserción de Registro',
          sql: `INSERT INTO users (name, email, status, role, created_at) VALUES ('Usuario Sincronizado', '${email}', '${status}', 'user', '${insertedUser.created_at}');`,
          purpose: 'Crea el registro al no existir previamente'
        });
        resultJson = JSON.stringify(insertedUser, null, 2);
        durationMs = 9.1;
        memoryMb = 1.5;
      }
      break;
    }

    case 'with': {
      const eager = !!params.eager;

      if (eager) {
        sql.push(`SELECT * FROM users;`);
        sql.push(`SELECT * FROM posts WHERE user_id IN (1, 2, 3, 4, 5);`);
        queriesCount = 2;
        
        querySteps.push({
          title: 'Consulta Principal',
          sql: `SELECT * FROM users;`,
          purpose: 'Carga todos los usuarios solicitados'
        });
        querySteps.push({
          title: 'Consulta de Relación (Eager Loading)',
          sql: `SELECT * FROM posts WHERE user_id IN (1, 2, 3, 4, 5);`,
          purpose: 'Optimización: Carga todos los posts relacionados de una sola vez filtrando por los IDs de usuarios obtenidos en el paso anterior'
        });

        const usersWithPosts = MOCK_USERS.map(u => ({
          ...u,
          posts: MOCK_POSTS.filter(p => p.user_id === u.id)
        }));
        
        matchedUserIds = MOCK_USERS.map(u => u.id);
        matchedPostIds = MOCK_POSTS.map(p => p.id);
        resultJson = JSON.stringify(usersWithPosts, null, 2);
        durationMs = 4.8;
        memoryMb = 2.1;
      } else {
        sql.push(`SELECT * FROM users;`);
        querySteps.push({
          title: 'Consulta Principal',
          sql: `SELECT * FROM users;`,
          purpose: 'Carga la colección de usuarios principal'
        });

        let queriesExecuted = 1;
        
        // Simular N queries flojas (Lazy queries en bucle)
        MOCK_USERS.forEach(u => {
          sql.push(`SELECT * FROM posts WHERE user_id = ${u.id};`);
          queriesExecuted++;
          querySteps.push({
            title: `Carga diferida para Usuario ID: ${u.id}`,
            sql: `SELECT * FROM posts WHERE user_id = ${u.id};`,
            purpose: `N+1 Problem: Consulta adicional para obtener los posts del usuario "${u.name}" en tiempo de ejecución de la vista`
          });
        });

        queriesCount = queriesExecuted;
        
        const usersWithPosts = MOCK_USERS.map(u => ({
          ...u,
          posts: MOCK_POSTS.filter(p => p.user_id === u.id)
        }));
        
        matchedUserIds = MOCK_USERS.map(u => u.id);
        matchedPostIds = MOCK_POSTS.map(p => p.id);
        resultJson = JSON.stringify(usersWithPosts, null, 2);
        // Lazy loading runs N+1 database roundtrips, meaning significantly higher duration
        durationMs = 25.6; 
        memoryMb = 4.5;
      }
      break;
    }

    case 'whereHas': {
      const minLikes = Number(params.minLikes ?? 50);

      // Query sql
      const sqlQuery = `SELECT * FROM users WHERE EXISTS (
    SELECT * FROM posts 
    WHERE users.id = posts.user_id 
    AND likes >= ${minLikes}
);`;
      sql.push(sqlQuery);
      queriesCount = 1;
      querySteps.push({
        title: 'whereHas()',
        sql: sqlQuery,
        purpose: 'Filtra la tabla usuarios comprobando la existencia de la relación post con likes mayores al parámetro'
      });

      // Filter logic
      // Find post matching criterion
      const matchedPosts = MOCK_POSTS.filter(p => p.likes >= minLikes);
      matchedPostIds = matchedPosts.map(p => p.id);

      const userIdsWithPopularPosts = Array.from(new Set(matchedPosts.map(p => p.user_id)));
      const filteredUsers = MOCK_USERS.filter(u => userIdsWithPopularPosts.includes(u.id));
      matchedUserIds = filteredUsers.map(u => u.id);

      resultJson = JSON.stringify(filteredUsers, null, 2);
      durationMs = 5.1;
      memoryMb = 1.3;
      break;
    }

    case 'paginate': {
      const perPage = Number(params.perPage || 2);
      const page = Number(params.page || 1);
      const offset = (page - 1) * perPage;

      sql.push(`SELECT COUNT(*) AS aggregate FROM users;`);
      sql.push(`SELECT * FROM users LIMIT ${perPage} OFFSET ${offset};`);
      queriesCount = 2;

      querySteps.push({
        title: 'Consulta de Conteo (Paginación)',
        sql: `SELECT COUNT(*) AS aggregate FROM users;`,
        purpose: 'Cuenta la cantidad total de registros en la base de datos para calcular el total de páginas'
      });
      querySteps.push({
        title: 'Consulta de Datos de Página',
        sql: `SELECT * FROM users LIMIT ${perPage} OFFSET ${offset};`,
        purpose: `Obtiene únicamente los registros correspondientes al segmento de la página actual (${page})`
      });

      const paginatedUsers = MOCK_USERS.slice(offset, offset + perPage);
      matchedUserIds = paginatedUsers.map(u => u.id);

      const total = MOCK_USERS.length;
      const lastPage = Math.ceil(total / perPage);

      const paginatorResponse = {
        current_page: page,
        data: paginatedUsers,
        first_page_url: `http://localhost/users?page=1`,
        from: offset + 1,
        last_page: lastPage,
        last_page_url: `http://localhost/users?page=${lastPage}`,
        next_page_url: page < lastPage ? `http://localhost/users?page=${page + 1}` : null,
        path: `http://localhost/users`,
        per_page: perPage,
        prev_page_url: page > 1 ? `http://localhost/users?page=${page - 1}` : null,
        to: Math.min(offset + perPage, total),
        total: total
      };

      resultJson = JSON.stringify(paginatorResponse, null, 2);
      durationMs = 4.5;
      memoryMb = 1.4;
      break;
    }

    case 'chunk': {
      const methodType = String(params.methodType || 'chunk');

      if (methodType === 'chunk') {
        queriesCount = 0;
        // Simular llamadas en chunk de tamaño 2
        const total = MOCK_USERS.length;
        const chunkSize = 2;
        let processed = 0;
        
        for (let offset = 0; offset < total; offset += chunkSize) {
          queriesCount++;
          sql.push(`SELECT * FROM users LIMIT ${chunkSize} OFFSET ${offset};`);
          querySteps.push({
            title: `Lote de Datos (Chunk Offset: ${offset})`,
            sql: `SELECT * FROM users LIMIT ${chunkSize} OFFSET ${offset};`,
            purpose: `Carga a memoria únicamente los registros desde la posición ${offset} a la ${offset + chunkSize - 1}`
          });
          processed += Math.min(chunkSize, total - offset);
        }

        matchedUserIds = MOCK_USERS.map(u => u.id);
        resultJson = `// Ejecución de callback en bloques:\n`;
        for (let i = 0; i < total; i += chunkSize) {
          const batch = MOCK_USERS.slice(i, i + chunkSize).map(u => u.name);
          resultJson += `Bloque ${Math.floor(i/chunkSize) + 1} Procesado: [${batch.join(', ')}]\n`;
        }
        resultJson += `Total procesados: ${processed} usuarios.`;
        
        durationMs = 6.8;
        memoryMb = 0.5; // Chunk keeps memory very low!
      } else {
        // Cursor
        sql.push(`SELECT * FROM users;`);
        queriesCount = 1;
        querySteps.push({
          title: 'Consulta Cursor (Generador)',
          sql: `SELECT * FROM users;`,
          purpose: 'Ejecuta una sola consulta, pero utiliza un cursor SQL interno para canalizar los registros uno por uno hacia PHP sin almacenarlos a la vez'
        });

        matchedUserIds = MOCK_USERS.map(u => u.id);
        resultJson = `// Iterando a través de un Generador PHP (LazyCollection):\n`;
        MOCK_USERS.forEach(u => {
          resultJson += `Iteración activa -> Objeto en Memoria: ${u.name} (Memoria: ~0.1 MB)\n`;
        });
        resultJson += `\nTotal procesados: ${MOCK_USERS.length} usuarios con un consumo máximo de 1 objeto en RAM simultáneamente.`;

        durationMs = 3.9;
        memoryMb = 0.15; // Cursor keeps memory at the absolute minimum
      }
      break;
    }

    default:
      break;
  }

  return {
    sql,
    matchedUserIds,
    matchedPostIds,
    insertedUser,
    updatedUser,
    resultJson,
    stats: {
      queriesCount,
      durationMs,
      memoryMb
    },
    querySteps
  };
}
