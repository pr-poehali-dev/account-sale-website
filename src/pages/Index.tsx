import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Product = { id: number; title: string; price: string; desc: string; image: string };
type Settings = { whyTitle: string; telegramChannel: string; buyProfile: string };
type User = { login: string; password: string };
type Tab = 'main' | 'why' | 'products' | 'buy';

const ADMIN = { login: 'rekko', password: '09082606' };
const LOGO = 'https://cdn.poehali.dev/projects/be822d67-e606-4cde-a4c9-6361944f02f7/bucket/0af2268f-b89c-4984-b650-296bb326d0f8.png';

const DEFAULT_SETTINGS: Settings = {
  whyTitle: 'ПОКАЧАНУ',
  telegramChannel: 'https://t.me/+AcRyQGT85vk0YTEx',
  buyProfile: 'https://t.me/mar11xuana',
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, title: 'Starter аккаунт', price: '149 ₽', desc: 'Чистый аккаунт для старта.', image: '' },
  { id: 2, title: 'Premium аккаунт', price: '499 ₽', desc: 'Редкие предметы и высокий уровень.', image: '' },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'main', label: 'Главная' },
  { id: 'buy', label: 'Купить' },
  { id: 'products', label: 'Товары' },
  { id: 'why', label: 'Почему' },
];

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const Index = () => {
  const [tab, setTab] = useState<Tab>('main');
  const [products, setProducts] = useState<Product[]>(() => load('rbx_products', DEFAULT_PRODUCTS));
  const [settings, setSettings] = useState<Settings>(() => load('rbx_settings', DEFAULT_SETTINGS));

  // Фикс: сохраняем isAdmin в localStorage чтобы не терялось при перезагрузке
  const [authUser, setAuthUser] = useState<string | null>(() => load<string | null>('rbx_current', null));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => load<boolean>('rbx_is_admin', false));

  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMogged, setShowMogged] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => { localStorage.setItem('rbx_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('rbx_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('rbx_current', JSON.stringify(authUser)); }, [authUser]);
  useEffect(() => { localStorage.setItem('rbx_is_admin', JSON.stringify(isAdmin)); }, [isAdmin]);

  const handleLogout = () => { setAuthUser(null); setIsAdmin(false); };

  const handleLogin = (login: string, password: string): string | null => {
    if (login === ADMIN.login && password === ADMIN.password) {
      setAuthUser(login); setIsAdmin(true); setShowAuth(false); return null;
    }
    const users = load<User[]>('rbx_users', []);
    const found = users.find((u) => u.login === login);
    if (found) {
      if (found.password !== password) return 'Неверный пароль';
      setAuthUser(login); setIsAdmin(false); setShowAuth(false); return null;
    }
    users.push({ login, password });
    localStorage.setItem('rbx_users', JSON.stringify(users));
    setAuthUser(login); setIsAdmin(false); setShowAuth(false); return null;
  };

  return (
    <div className="min-h-screen text-foreground">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 glass border-b border-primary/25">
        <div className="container flex items-center justify-between py-2">
          <button onClick={() => setTab('main')} className="hover-scale">
            <img src={LOGO} alt="TEKKO AKKZ" className="h-10 md:h-11 w-auto object-contain drop-shadow-[0_0_14px_rgba(170,90,255,0.65)]" />
          </button>

          {/* desktop nav */}
          <nav className="hidden md:flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`font-display px-4 py-2 rounded-lg text-sm uppercase tracking-wider transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(170,90,255,0.4)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* auth area */}
          <div className="flex items-center gap-2">
            {authUser ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-primary/20">
                  {isAdmin && <span className="text-accent text-xs font-display uppercase">Admin</span>}
                  {isAdmin && <span className="text-primary/40 text-xs">|</span>}
                  <span className="text-sm text-foreground font-body">{authUser}</span>
                </div>
                {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => setShowAdmin(true)}
                    className="font-display uppercase tracking-wider text-xs bg-gradient-to-r from-primary to-accent"
                  >
                    <Icon name="Settings" size={14} /> Админка
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleLogout} className="text-muted-foreground">
                  <Icon name="LogOut" size={16} />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAuth(true)}
                className="font-display uppercase tracking-wider text-xs bg-gradient-to-r from-primary to-accent"
              >
                <Icon name="User" size={14} /> Войти
              </Button>
            )}
          </div>
        </div>

        {/* mobile nav */}
        <nav className="md:hidden flex gap-1 pb-2 px-4 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-display text-xs px-3 py-1.5 rounded-lg uppercase whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-gradient-to-r from-primary to-accent text-white' : 'text-muted-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ══ MAIN TAB ══ */}
      {tab === 'main' && (
        <section className="relative grid-bg overflow-hidden min-h-[calc(100vh-73px)] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] rounded-full bg-primary/20 blur-[160px] pointer-events-none" />

          <div className="relative z-10 text-center px-4 animate-fade-in flex flex-col items-center gap-6">
            <img
              src={LOGO}
              alt="TEKKO AKKZ"
              className="w-[82vw] max-w-[480px] object-contain animate-float drop-shadow-[0_0_60px_rgba(170,90,255,0.65)]"
            />

            <div>
              <h1 className="font-display text-2xl md:text-4xl uppercase chrome-text tracking-wide leading-tight">
                Самые дешевые аккаунты<br />в Roblox
              </h1>
              <p className="mt-2 text-muted-foreground font-body uppercase tracking-[0.35em] text-[10px] md:text-xs">
                y2k rave · hardtek · jumpstyle · 2000s
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button
                size="lg"
                className="font-display uppercase tracking-widest px-8 py-5 hover-scale bg-gradient-to-r from-primary to-accent neon-box"
                onClick={() => setTab('products')}
              >
                <Icon name="Zap" size={18} /> Товары
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="font-display uppercase tracking-widest px-8 py-5 hover-scale glass"
                onClick={() => setTab('buy')}
              >
                <Icon name="ShoppingCart" size={18} /> Купить
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ══ WHY TAB ══ */}
      {tab === 'why' && (
        <section className="relative grid-bg overflow-hidden min-h-[calc(100vh-73px)] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] rounded-full bg-primary/25 blur-[130px] pointer-events-none" />

          <div className="relative z-10 text-center px-4 animate-fade-in">
            <h1 className="font-display font-black chrome-text leading-none text-[18vw] md:text-[12vw] uppercase">
              {settings.whyTitle}
            </h1>
            <p className="mt-4 text-muted-foreground font-body uppercase tracking-[0.35em] text-xs">
              roblox accounts · y2k hardtek
            </p>
            <button
              onClick={() => { setShowMogged(true); setTimeout(() => setShowMogged(false), 2500); }}
              className="mt-10 font-display text-base md:text-lg uppercase tracking-widest px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white neon-box hover-scale"
            >
              По капусте 🥬
            </button>
          </div>

          {showMogged && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 animate-scale-in" onClick={() => setShowMogged(false)}>
              <span
                className="font-display font-black uppercase text-[20vw] animate-glitch select-none"
                style={{ color: '#ff1f4b', textShadow: '0 0 50px #ff1f4b, 0 0 100px #ff1f4b88' }}
              >
                mogged
              </span>
            </div>
          )}
        </section>
      )}

      {/* ══ PRODUCTS TAB ══ */}
      {tab === 'products' && (
        <section className="container py-14 animate-fade-in">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-4xl md:text-5xl uppercase chrome-text">Товары</h2>
            <span className="font-orb text-xs text-muted-foreground uppercase tracking-widest border border-primary/30 px-3 py-1 rounded-full">
              {products.length} шт.
            </span>
          </div>

          {products.length === 0 ? (
            <div className="glass rounded-2xl p-20 text-center">
              <Icon name="PackageOpen" size={52} className="mx-auto mb-4 opacity-30" />
              <p className="font-display uppercase tracking-widest text-muted-foreground">Пока нет товаров</p>
              <p className="text-xs text-muted-foreground mt-2 font-body">Войдите как rekko и добавьте через админку</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="card-glow rounded-2xl glass overflow-hidden animate-scale-in group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {p.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(268_50%_9%)] to-transparent" />
                      <span className="absolute top-3 right-3 font-display text-sm px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                        {p.price}
                      </span>
                    </div>
                  ) : (
                    <div className="h-20 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="font-display text-2xl chrome-text">{p.price}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-lg uppercase tracking-wide">{p.title}</h3>
                    {p.desc && <p className="text-sm text-muted-foreground mt-1.5 font-body">{p.desc}</p>}
                    <Button
                      className="w-full mt-4 font-display uppercase tracking-wider bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      onClick={() => { setTab('buy'); setBuyOpen(true); }}
                    >
                      <Icon name="Zap" size={16} /> Купить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══ BUY TAB ══ */}
      {tab === 'buy' && (
        <section className="relative container py-24 flex flex-col items-center animate-fade-in min-h-[calc(100vh-73px)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] max-w-[500px] rounded-full bg-accent/15 blur-[130px] pointer-events-none" />

          <img src={LOGO} alt="TEKKO AKKZ" className="relative w-52 mb-6 object-contain animate-float drop-shadow-[0_0_30px_rgba(170,90,255,0.5)]" />
          <h2 className="relative font-display text-4xl md:text-5xl uppercase chrome-text text-center mb-3">Купить аккаунт</h2>
          <p className="relative text-muted-foreground font-body text-sm mb-12 uppercase tracking-widest">Выберите способ</p>

          {!buyOpen ? (
            <Button
              size="lg"
              className="relative font-display text-lg uppercase tracking-widest px-12 py-7 neon-box hover-scale bg-gradient-to-r from-primary to-accent"
              onClick={() => setBuyOpen(true)}
            >
              <Icon name="ShoppingCart" size={20} /> Показать варианты
            </Button>
          ) : (
            <div className="relative flex flex-col sm:flex-row gap-4 animate-scale-in w-full max-w-md">
              <a href={settings.telegramChannel} target="_blank" rel="noreferrer" className="flex-1">
                <Button size="lg" variant="secondary" className="w-full font-display uppercase tracking-wider py-7 hover-scale glass border border-primary/30">
                  <Icon name="Send" size={18} /> Тг канал
                </Button>
              </a>
              <a href={settings.buyProfile} target="_blank" rel="noreferrer" className="flex-1">
                <Button size="lg" className="w-full font-display uppercase tracking-wider py-7 neon-box hover-scale bg-gradient-to-r from-primary to-accent">
                  <Icon name="CreditCard" size={18} /> Купить
                </Button>
              </a>
            </div>
          )}
        </section>
      )}

      {/* ══ AUTH MODAL ══ */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}

      {/* ══ ADMIN MODAL ══ */}
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

/* ─── AUTH MODAL ─── */
const AuthModal = ({ onClose, onLogin }: { onClose: () => void; onLogin: (l: string, p: string) => string | null }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl glass p-7 neon-box animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <img src={LOGO} alt="TEKKO AKKZ" className="h-8 w-auto object-contain" />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        <h3 className="font-display text-xl uppercase chrome-text mb-5">Вход</h3>
        <div className="space-y-3">
          <Input
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setPassword('')}
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!login || !password) { setErr('Заполните все поля'); return; }
                const res = onLogin(login.trim(), password);
                if (res) setErr(res);
              }
            }}
          />
          {err && (
            <div className="flex items-center gap-2 text-destructive text-sm font-body">
              <Icon name="AlertCircle" size={14} /> {err}
            </div>
          )}
          <Button
            className="w-full font-display uppercase tracking-wider bg-gradient-to-r from-primary to-accent mt-1"
            onClick={() => {
              if (!login || !password) { setErr('Заполните все поля'); return; }
              const res = onLogin(login.trim(), password);
              if (res) setErr(res);
            }}
          >
            Войти
          </Button>
          <p className="text-xs text-muted-foreground text-center font-body pt-1">
            Нет аккаунта — создастся автоматически
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── ADMIN PANEL ─── */
const AdminPanel = ({
  products, setProducts, settings, setSettings, onClose,
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
  const [activeSection, setActiveSection] = useState<'products' | 'settings'>('products');

  const addProduct = () => {
    if (!title || !price) return;
    setProducts([...products, { id: Date.now(), title, price, desc, image }]);
    setTitle(''); setPrice(''); setDesc(''); setImage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl my-8 rounded-2xl glass neon-box overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="TEKKO AKKZ" className="h-8 w-auto object-contain" />
            <h3 className="font-display text-xl uppercase chrome-text">Админ-панель</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        {/* section tabs */}
        <div className="flex border-b border-primary/20">
          {(['products', 'settings'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`flex-1 py-3 font-display text-sm uppercase tracking-wider transition-all ${
                activeSection === s
                  ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'products' ? '📦 Товары' : '⚙️ Настройки'}
            </button>
          ))}
        </div>

        <div className="p-7">
          {activeSection === 'products' && (
            <div>
              {/* add product form */}
              <h4 className="font-display text-sm uppercase tracking-wider text-accent mb-4">Добавить товар</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input placeholder="Цена (499 ₽)" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <Input className="mt-3" placeholder="Ссылка на картинку (необязательно)" value={image} onChange={(e) => setImage(e.target.value)} />
              <Textarea className="mt-3" placeholder="Описание" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
              <Button
                className="mt-3 font-display uppercase tracking-wider bg-gradient-to-r from-primary to-accent"
                onClick={addProduct}
                disabled={!title || !price}
              >
                <Icon name="Plus" size={16} /> Добавить
              </Button>

              {/* product list */}
              <div className="mt-6 space-y-2">
                {products.length === 0 && (
                  <p className="text-muted-foreground text-sm font-body text-center py-4">Товаров нет</p>
                )}
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/5">
                    <div className="min-w-0">
                      <span className="font-display text-sm uppercase">{p.title}</span>
                      <span className="ml-2 text-accent font-display text-sm">{p.price}</span>
                    </div>
                    <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="text-destructive hover:opacity-70 transition-opacity shrink-0">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-4">
              <h4 className="font-display text-sm uppercase tracking-wider text-accent mb-4">Настройки сайта и ссылок</h4>
              {[
                { label: 'Текст на вкладке «Почему»', key: 'whyTitle' as const },
                { label: 'Ссылка на Телеграм канал', key: 'telegramChannel' as const },
                { label: 'Ссылка «Купить» (профиль)', key: 'buyProfile' as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground font-body block mb-1">{label}</label>
                  <Input value={local[key]} onChange={(e) => setLocal({ ...local, [key]: e.target.value })} />
                </div>
              ))}
              <Button
                className="w-full font-display uppercase tracking-wider bg-gradient-to-r from-primary to-accent mt-2"
                onClick={() => { setSettings(local); onClose(); }}
              >
                <Icon name="Save" size={16} /> Сохранить
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
