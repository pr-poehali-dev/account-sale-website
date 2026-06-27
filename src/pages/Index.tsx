import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Product = {
  id: number;
  title: string;
  price: string;
  desc: string;
  image: string;
};

type Settings = {
  capybaraImage: string;
  whyTitle: string;
  telegramChannel: string;
  buyProfile: string;
};

type User = { login: string; password: string };

const ADMIN = { login: 'rekko', password: '09082606' };

const DEFAULT_SETTINGS: Settings = {
  capybaraImage:
    'https://cdn.poehali.dev/projects/be822d67-e606-4cde-a4c9-6361944f02f7/files/e1e19650-8c06-4471-8cd8-1d6c1386cfe0.jpg',
  whyTitle: 'ПОКАЧАНУ',
  telegramChannel: 'https://t.me/+AcRyQGT85vk0YTEx',
  buyProfile: 'https://t.me/mar11xuana',
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Premium аккаунт',
    price: '499 ₽',
    desc: 'Топовый аккаунт с редкими предметами и высоким уровнем.',
    image:
      'https://cdn.poehali.dev/projects/be822d67-e606-4cde-a4c9-6361944f02f7/files/e1e19650-8c06-4471-8cd8-1d6c1386cfe0.jpg',
  },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

type Tab = 'why' | 'products' | 'buy';

const Index = () => {
  const [tab, setTab] = useState<Tab>('why');
  const [products, setProducts] = useState<Product[]>(() =>
    load('rbx_products', DEFAULT_PRODUCTS),
  );
  const [settings, setSettings] = useState<Settings>(() =>
    load('rbx_settings', DEFAULT_SETTINGS),
  );

  const [authUser, setAuthUser] = useState<string | null>(() =>
    load<string | null>('rbx_current', null),
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMogged, setShowMogged] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rbx_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('rbx_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('rbx_current', JSON.stringify(authUser));
  }, [authUser]);

  return (
    <div className="min-h-screen text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-primary/30 bg-background/70">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => setTab('why')}
            className="font-display text-2xl font-black tracking-widest neon-text"
          >
            RBX<span className="text-accent">.SHOP</span>
          </button>

          <nav className="hidden md:flex gap-2 font-display text-sm">
            {(['buy', 'products', 'why'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md uppercase tracking-wider transition ${
                  tab === t
                    ? 'bg-primary text-primary-foreground neon-box'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'buy' ? 'Купить' : t === 'products' ? 'Товары' : 'Почему'}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {authUser}
                </span>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowAdmin(true)}
                  >
                    <Icon name="Settings" size={16} /> Админка
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setAuthUser(null);
                    setIsAdmin(false);
                  }}
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setShowAuth(true)}>
                Войти
              </Button>
            )}
          </div>
        </div>

        {/* mobile nav */}
        <nav className="md:hidden flex justify-center gap-2 pb-3 font-display text-xs">
          {(['buy', 'products', 'why'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md uppercase ${
                tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {t === 'buy' ? 'Купить' : t === 'products' ? 'Товары' : 'Почему'}
            </button>
          ))}
        </nav>
      </header>

      {/* WHY TAB */}
      {tab === 'why' && (
        <section className="relative grid-bg overflow-hidden min-h-[calc(100vh-73px)] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
          <div className="relative z-10 text-center px-4 animate-fade-in">
            <img
              src={settings.capybaraImage}
              alt="capy"
              className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-3xl mx-auto mb-8 neon-box animate-float"
            />
            <h1 className="font-display font-black neon-text leading-none text-[15vw] md:text-[10vw] uppercase">
              {settings.whyTitle}
            </h1>
            <button
              onClick={() => {
                setShowMogged(true);
                setTimeout(() => setShowMogged(false), 2500);
              }}
              className="mt-10 font-display text-lg uppercase tracking-widest px-10 py-4 rounded-xl bg-primary text-primary-foreground neon-box hover-scale"
            >
              По капусте 🥬
            </button>
          </div>

          {showMogged && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-scale-in">
              <h2
                className="font-display font-black uppercase text-[18vw] animate-glitch"
                style={{ color: '#ff1f4b', textShadow: '0 0 40px #ff1f4b' }}
              >
                mogged
              </h2>
            </div>
          )}
        </section>
      )}

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <section className="container py-12 animate-fade-in">
          <h2 className="font-display text-4xl font-black uppercase neon-text mb-8">
            Товары
          </h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground">Пока нет товаров.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-card border border-primary/30 overflow-hidden hover-scale neon-box"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-44 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold uppercase">
                        {p.title}
                      </h3>
                      <span className="font-display text-accent font-black whitespace-nowrap">
                        {p.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{p.desc}</p>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setTab('buy')}
                    >
                      Купить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* BUY TAB */}
      {tab === 'buy' && (
        <section className="container py-16 flex flex-col items-center animate-fade-in">
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase neon-text text-center mb-12">
            Купить аккаунт
          </h2>
          {!buyOpen ? (
            <Button
              size="lg"
              className="font-display text-xl uppercase tracking-widest px-12 py-7 neon-box hover-scale"
              onClick={() => setBuyOpen(true)}
            >
              <Icon name="ShoppingCart" size={22} /> Открыть
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-5 animate-scale-in">
              <a href={settings.telegramChannel} target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-display uppercase tracking-wider px-10 py-7 hover-scale"
                >
                  <Icon name="Send" size={20} /> Телеграм канал
                </Button>
              </a>
              <a href={settings.buyProfile} target="_blank" rel="noreferrer">
                <Button
                  size="lg"
                  className="font-display uppercase tracking-wider px-10 py-7 neon-box hover-scale"
                >
                  <Icon name="CreditCard" size={20} /> Купить
                </Button>
              </a>
            </div>
          )}
        </section>
      )}

      {/* AUTH MODAL */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={(login, password) => {
            if (login === ADMIN.login && password === ADMIN.password) {
              setAuthUser(login);
              setIsAdmin(true);
              setShowAuth(false);
              return null;
            }
            const users = load<User[]>('rbx_users', []);
            const found = users.find((u) => u.login === login);
            if (found) {
              if (found.password !== password) return 'Неверный пароль';
              setAuthUser(login);
              setIsAdmin(false);
              setShowAuth(false);
              return null;
            }
            users.push({ login, password });
            localStorage.setItem('rbx_users', JSON.stringify(users));
            setAuthUser(login);
            setIsAdmin(false);
            setShowAuth(false);
            return null;
          }}
        />
      )}

      {/* ADMIN MODAL */}
      {showAdmin && isAdmin && (
        <AdminPanel
          products={products}
          setProducts={setProducts}
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
};

/* ---------- AUTH ---------- */
const AuthModal = ({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (login: string, password: string) => string | null;
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-primary/40 p-7 neon-box animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-black uppercase neon-text">
            Вход / Регистрация
          </h3>
          <button onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-destructive text-sm">{err}</p>}
          <Button
            className="w-full font-display uppercase tracking-wider"
            onClick={() => {
              if (!login || !password) {
                setErr('Заполните все поля');
                return;
              }
              const res = onLogin(login.trim(), password);
              if (res) setErr(res);
            }}
          >
            Войти
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Нет аккаунта? Введите логин и пароль — мы создадим его автоматически.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- ADMIN ---------- */
const AdminPanel = ({
  products,
  setProducts,
  settings,
  setSettings,
  onClose,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [local, setLocal] = useState<Settings>(settings);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl my-8 rounded-2xl bg-card border border-primary/40 p-7 neon-box">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-black uppercase neon-text">
            Админ-панель
          </h3>
          <button onClick={onClose}>
            <Icon name="X" size={22} />
          </button>
        </div>

        {/* Add product */}
        <div className="mb-8">
          <h4 className="font-display uppercase text-sm tracking-wider text-accent mb-3">
            Добавить товар
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Цена (напр. 499 ₽)" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <Input className="mt-3" placeholder="Ссылка на изображение (необязательно)" value={image} onChange={(e) => setImage(e.target.value)} />
          <Textarea className="mt-3" placeholder="Описание" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Button
            className="mt-3 font-display uppercase tracking-wider"
            onClick={() => {
              if (!title || !price) return;
              setProducts([
                ...products,
                { id: Date.now(), title, price, desc, image },
              ]);
              setTitle('');
              setPrice('');
              setDesc('');
              setImage('');
            }}
          >
            <Icon name="Plus" size={18} /> Добавить
          </Button>
        </div>

        {/* Product list */}
        <div className="mb-8">
          <h4 className="font-display uppercase text-sm tracking-wider text-accent mb-3">
            Товары ({products.length})
          </h4>
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-2"
              >
                <span className="truncate">
                  <b>{p.title}</b> — {p.price}
                </span>
                <button
                  onClick={() => setProducts(products.filter((x) => x.id !== p.id))}
                  className="text-destructive"
                >
                  <Icon name="Trash2" size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h4 className="font-display uppercase text-sm tracking-wider text-accent mb-3">
            Настройки сайта и ссылок
          </h4>
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground">Текст на вкладке «Почему»</label>
            <Input value={local.whyTitle} onChange={(e) => setLocal({ ...local, whyTitle: e.target.value })} />
            <label className="text-xs text-muted-foreground">Картинка на вкладке «Почему»</label>
            <Input value={local.capybaraImage} onChange={(e) => setLocal({ ...local, capybaraImage: e.target.value })} />
            <label className="text-xs text-muted-foreground">Ссылка на Телеграм канал</label>
            <Input value={local.telegramChannel} onChange={(e) => setLocal({ ...local, telegramChannel: e.target.value })} />
            <label className="text-xs text-muted-foreground">Ссылка на профиль (кнопка «Купить»)</label>
            <Input value={local.buyProfile} onChange={(e) => setLocal({ ...local, buyProfile: e.target.value })} />
            <Button
              className="font-display uppercase tracking-wider"
              onClick={() => {
                setSettings(local);
                onClose();
              }}
            >
              <Icon name="Save" size={18} /> Сохранить настройки
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
