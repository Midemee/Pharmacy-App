import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Boxes, BriefcaseMedical,
  Check, ChevronDown, CircleHelp, ClipboardList, Clock3, LayoutDashboard, LogOut,
  Menu, Package, Plus, Search, ShieldCheck, ShoppingCart, Sparkles, TrendingUp,
  Users, X, AlertTriangle, Pill, Trash2, Pencil, RefreshCw, ChartNoAxesCombined
} from 'lucide-react'
import { api, clearSession, getSavedUser, getToken, saveSession } from './api'

const AuthContext = createContext(null)
const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser)
  const [token, setToken] = useState(getToken)
  const signIn = (data) => {
    const nextUser = { userName: data.userName, fullName: data.fullName }
    saveSession(data.jwtId, nextUser)
    setUser(nextUser); setToken(data.jwtId)
  }
  const signOut = async () => {
    try { if (user?.userName) await api.logout(user.userName) } catch (e) { console.warn(e) }
    clearSession(); setUser(null); setToken('')
  }
  return <AuthContext.Provider value={{ user, token, signIn, signOut }}>{children}</AuthContext.Provider>
}

function Brand({ light = false }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/">
    <span className="brand-mark"><BriefcaseMedical size={25} strokeWidth={2.5}/></span>
    <span><strong>Chemist<span>Pro</span></strong><small>Manage. Stock. Grow.</small></span>
  </Link>
}

function Landing() {
  return <div className="landing">
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="public-nav"><a href="#home">Home</a><a href="#about">About</a><a href="#features">Features</a><a href="#contact">Contact</a></nav>
        <div className="header-actions"><Link className="btn btn-outline" to="/login">Sign In</Link><Link className="btn btn-green" to="/register">Register</Link></div>
      </div>
    </header>
    <main>
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-dot"></span> A smarter way to run your pharmacy</div>
          <h1>Your Pharmacy,<br/><span>Perfectly in stock.</span></h1>
          <p className="hero-subtitle">Know your shelves, grow your sales.</p>
          <p className="hero-copy">Take control of your inventory, keep essential medicines within reach, and make every sale count — all from one simple workspace.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/register">Get Started <ArrowRight size={18}/></Link><Link className="btn btn-outline btn-large" to="/login">Sign In</Link></div>
          <div className="hero-trust"><ShieldCheck size={17}/> Simple, secure pharmacy management</div>
        </div>
        <div className="hero-image-credit">Built for the people who care for your community.</div>
      </section>
      <section className="benefits-wrap" id="features">
        <div className="benefits">
          <Feature icon={<Boxes/>} title="Real-time inventory" text="Know what is on your shelves"/>
          <Feature icon={<ChartNoAxesCombined/>} title="Smarter sales" text="Make every transaction count"/>
          <Feature icon={<ShieldCheck/>} title="Secure & reliable" text="Your pharmacy data matters"/>
          <Feature icon={<Activity/>} title="Stock insights" text="Spot low stock early"/>
        </div>
      </section>
      <section className="about-section" id="about">
        <div className="about-copy"><div className="section-kicker">LESS GUESSWORK. MORE GROWTH.</div><h2>Everything your pharmacy needs, <span>in one place.</span></h2><p>From receiving new stock to dispensing medicines, ChemistPro helps you stay organised and serve your customers with confidence.</p><Link to="/register" className="text-link">Explore ChemistPro <ArrowRight size={17}/></Link></div>
        <div className="about-cards">
          <div className="mini-card"><div className="mini-icon mint"><Package/></div><strong>Inventory, simplified</strong><p>Add, update and find medicines without the paperwork.</p></div>
          <div className="mini-card"><div className="mini-icon blue"><ShoppingCart/></div><strong>Dispensing made easy</strong><p>Process sales and automatically update available stock.</p></div>
        </div>
      </section>
      <section className="cta-band" id="contact"><div><span>READY TO GET ORGANISED?</span><h2>Give your pharmacy room to grow.</h2></div><Link className="btn btn-white" to="/register">Create your account <ArrowRight size={17}/></Link></section>
    </main>
    <Footer />
  </div>
}

function Feature({ icon, title, text }) {
  return <div className="benefit"><div className="benefit-icon">{icon}</div><div><strong>{title}</strong><small>{text}</small></div></div>
}

function Footer() {
  return <footer className="footer"><div className="footer-main"><Brand light/><div className="footer-links"><strong>Quick links</strong><a href="#home">Home</a><a href="#about">About</a><a href="#features">Features</a></div><div className="footer-links"><strong>Get started</strong><Link to="/login">Sign in</Link><Link to="/register">Create account</Link><a href="mailto:support@chemistpro.app">Contact support</a></div><div className="footer-note"><div className="footer-badge"><ShieldCheck size={18}/> Built for better pharmacy operations</div><p>Smarter pharmacy management for a healthier tomorrow.</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ChemistPro. All rights reserved.</span><span>Manage. Stock. Grow.</span></div></footer>
}

function AuthLayout({ mode }) {
  const isRegister = mode === 'register'
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', userName: '', passWord: '', storeName: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setError(''); setSuccess(''); setBusy(true)
    try {
      if (isRegister) {
        await api.register(form)
        setSuccess('Your account has been created. You can now sign in.')
        setTimeout(() => navigate('/login'), 900)
      } else {
        const data = await api.login({ userName: form.userName, password: form.passWord })
        signIn(data); navigate('/app')
      }
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-aside"><Brand light/><div className="auth-aside-content"><div className="auth-pill"><Sparkles size={14}/> YOUR PHARMACY, IN SYNC</div><h1>More clarity.<br/><span>Less counting.</span></h1><p>Keep your medicines organised and your pharmacy moving forward with ChemistPro.</p><div className="auth-aside-bottom"><ShieldCheck size={18}/> A clearer view of your pharmacy, every day.</div></div><div className="auth-aside-orb orb-one"></div><div className="auth-aside-orb orb-two"></div></div>
    <div className="auth-main"><Link to="/" className="back-home">← Back to home</Link><div className="auth-form-wrap"><div className="auth-mobile-brand"><Brand/></div><div className="form-heading"><div className="form-icon"><BriefcaseMedical size={22}/></div><h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2><p>{isRegister ? 'Set up your pharmacy workspace in a few steps.' : 'Sign in to continue to your pharmacy workspace.'}</p></div>
      <form onSubmit={submit} className="auth-form">
        {isRegister && <><label>Full name<input name="fullName" value={form.fullName} onChange={update} placeholder="e.g. Amaka Okafor" required/></label><label>Pharmacy name<input name="storeName" value={form.storeName} onChange={update} placeholder="e.g. Greenfield Pharmacy" required/></label></>}
        <label>Username<input name="userName" value={form.userName} onChange={update} placeholder="Enter your username" autoComplete="username" required/></label>
        <label>Password<input type="password" name="passWord" value={form.passWord} onChange={update} placeholder="Enter your password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} required/>{isRegister && <small className="field-hint">Use at least 8 characters, including an uppercase letter and a number.</small>}</label>
        {error && <div className="alert alert-error"><AlertTriangle size={16}/>{error}</div>}
        {success && <div className="alert alert-success"><Check size={16}/>{success}</div>}
        <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={17}/></button>
      </form>
      <p className="auth-switch">{isRegister ? 'Already have an account?' : "Don't have an account?"} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create one'}</Link></p>
      <p className="auth-legal">By continuing, you agree to use ChemistPro responsibly and keep your account details secure.</p>
    </div></div></div>
}

function Protected({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace/>
}

const money = value => `₦${Number(value || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`
const getExpiryState = date => {
  if (!date) return 'Unknown'
  const days = (new Date(date) - new Date()) / 86400000
  if (days < 0) return 'Expired'
  if (days <= 90) return 'Expiring soon'
  return 'Good'
}

function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [drugs, setDrugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const load = async () => {
    setError('')
    try { const result = await api.getDrugs(); setDrugs(Array.isArray(result) ? result : []) }
    catch (e) { setError(e.message || 'Could not load your inventory.') }
    finally { setLoading(false); setRefreshing(false) }
  }
  useEffect(() => { load() }, [])
  const refresh = () => { setRefreshing(true); load() }
  const totalUnits = drugs.reduce((sum, d) => sum + Number(d.quantityInStock || 0), 0)
  const lowStock = drugs.filter(d => Number(d.quantityInStock || 0) <= 10).length
  const expired = drugs.filter(d => getExpiryState(d.expiryDate) === 'Expired').length
  const logout = async () => { await signOut(); navigate('/') }
  const navItems = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/app/inventory', label: 'Medicine inventory', icon: Package },
    { to: '/app/dispense', label: 'Dispense & sales', icon: ShoppingCart }
  ]
  return <div className="dashboard-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}><div className="sidebar-top"><Brand light/><button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)}><X/></button></div><div className="workspace-label">WORKSPACE</div><nav className="side-nav">{navItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}><item.icon size={18}/>{item.label}</NavLink>)}</nav><div className="sidebar-help"><div className="help-icon"><CircleHelp size={18}/></div><strong>Need a hand?</strong><p>Keep your pharmacy running smoothly.</p><a href="mailto:support@chemistpro.app">Contact support <ArrowRight size={14}/></a></div><button className="sidebar-logout" onClick={logout}><LogOut size={18}/> Sign out</button></aside>
    {sidebarOpen && <div className="sidebar-scrim" onClick={() => setSidebarOpen(false)}></div>}
    <main className="dashboard-main"><header className="dash-topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)}><Menu/></button><div><span className="breadcrumb">Workspace /</span><strong> {location.pathname.endsWith('/inventory') ? 'Inventory' : location.pathname.endsWith('/dispense') ? 'Dispense & sales' : 'Overview'}</strong></div></div><div className="topbar-right"><div className="online-status"><span></span> Workspace active</div><button className="notification-btn" title="Notifications"><Bell size={18}/><i></i></button><div className="user-chip"><div className="avatar">{(user?.fullName || user?.userName || 'U').slice(0,1).toUpperCase()}</div><div><strong>{user?.fullName || user?.userName || 'Pharmacy user'}</strong><small>Pharmacy manager</small></div><ChevronDown size={15}/></div></div></header>
      <div className="dashboard-content"><Routes>
        <Route index element={<Overview drugs={drugs} loading={loading} error={error} refresh={refresh} refreshing={refreshing} totalUnits={totalUnits} lowStock={lowStock} expired={expired}/>}/>
        <Route path="inventory" element={<Inventory drugs={drugs} setDrugs={setDrugs} loading={loading} error={error} refresh={refresh}/>}/>
        <Route path="dispense" element={<Dispense drugs={drugs} refresh={refresh}/>}/>
        <Route path="*" element={<Navigate to="/app" replace/>}/>
      </Routes></div>
    </main>
  </div>
}

function PageHeading({ kicker, title, description, action }) {
  return <div className="page-heading"><div><div className="section-kicker">{kicker}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}
function StatCard({ label, value, note, icon: Icon, tone = 'mint', trend }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{trend && <span><ArrowUpRight size={13}/>{trend}</span>}{note}</div></div>
}
function Overview({ drugs, loading, error, refresh, refreshing, totalUnits, lowStock, expired }) {
  const navigate = useNavigate()
  const recent = [...drugs].slice(0, 5)
  return <><PageHeading kicker="YOUR PHARMACY AT A GLANCE" title="Good to see you." description="Here's what's happening with your pharmacy today." action={<button className="btn btn-soft" onClick={refresh} disabled={refreshing}><RefreshCw size={16} className={refreshing ? 'spin' : ''}/> Refresh data</button>}/>
    {error && <div className="alert alert-error"><AlertTriangle size={16}/>{error} <span>Check that your backend is running and the API URL is correct.</span></div>}
    <div className="welcome-banner"><div><div className="welcome-tag"><Sparkles size={14}/> YOUR DAILY SNAPSHOT</div><h2>Stay stocked. Stay ready.</h2><p>A clear view of your medicines helps you make confident decisions.</p></div><div className="banner-art"><Pill size={52}/><span><i></i><i></i><i></i></span></div></div>
    <div className="stats-grid"><StatCard label="Medicine types" value={loading ? '—' : drugs.length} note="Unique products in inventory" icon={Package}/><StatCard label="Total units in stock" value={loading ? '—' : totalUnits.toLocaleString()} note="Across all medicines" icon={Boxes} tone="blue"/><StatCard label="Low stock alerts" value={loading ? '—' : lowStock} note="10 units or fewer" icon={AlertTriangle} tone="amber"/><StatCard label="Expired medicines" value={loading ? '—' : expired} note="Review these items" icon={Clock3} tone="rose"/></div>
    <div className="content-grid"><section className="panel recent-panel"><div className="panel-heading"><div><h3>Medicine inventory</h3><p>Your latest inventory records</p></div><button className="text-link" onClick={() => navigate('/app/inventory')}>View all <ArrowRight size={15}/></button></div><DrugTable drugs={recent} loading={loading} compact/></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Get things done faster</p></div></div><button className="quick-action" onClick={() => navigate('/app/inventory?add=1')}><span className="quick-icon mint"><Plus/></span><span><strong>Add a medicine</strong><small>Update your shelves</small></span><ArrowRight size={17}/></button><button className="quick-action" onClick={() => navigate('/app/dispense')}><span className="quick-icon blue"><ShoppingCart/></span><span><strong>Record a sale</strong><small>Dispense medicines</small></span><ArrowRight size={17}/></button><div className="stock-tip"><div><ShieldCheck size={17}/> <strong>Stock tip</strong></div><p>Review expiry dates regularly and keep fast-moving medicines replenished.</p></div></section></div>
  </>
}

function DrugTable({ drugs, loading, compact = false, onEdit, onDelete }) {
  if (loading) return <div className="empty-state"><div className="loader"></div><p>Loading your medicines...</p></div>
  if (!drugs.length) return <div className="empty-state"><div className="empty-icon"><Package size={25}/></div><strong>No medicines yet</strong><p>Add your first medicine to start building your inventory.</p></div>
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>MEDICINE</th><th>STRENGTH / DOSAGE</th>{!compact && <th>MANUFACTURER</th>}<th>STOCK</th><th>PRICE</th><th>EXPIRY</th>{!compact && <th>ACTIONS</th>}</tr></thead><tbody>{drugs.map((d, i) => <tr key={d.id ?? `${d.brandName}-${i}`}><td><div className="medicine-cell"><span className="medicine-avatar"><Pill size={17}/></span><span><strong>{d.brandName || 'Unnamed medicine'}</strong><small>{d.genericName || 'Generic name not set'}</small></span></div></td><td>{d.strength || '—'}<small className="table-sub">{d.dosage || ''}</small></td>{!compact && <td>{d.manufacturer || '—'}</td>}<td><span className={`stock-pill ${Number(d.quantityInStock) <= 10 ? 'stock-low' : 'stock-ok'}`}>{Number(d.quantityInStock || 0)} units</span></td><td className="price-cell">{money(d.price)}</td><td><span className={`expiry-text ${getExpiryState(d.expiryDate) !== 'Good' ? 'expiry-warning' : ''}`}>{d.expiryDate || '—'}</span></td>{!compact && <td><div className="table-actions"><button title="Edit medicine" onClick={() => onEdit?.(d)}><Pencil size={15}/></button><button title="Delete medicine" onClick={() => onDelete?.(d)}><Trash2 size={15}/></button></div></td>}</tr>)}</tbody></table></div>
}

const emptyDrug = { brandName:'', genericName:'', strength:'', dosage:'', manufacturer:'', batchNumber:'', manufactureDate:'', expiryDate:'', price:'', quantityInStock:'' }
function DrugModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyDrug)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const editing = Boolean(initial?.id)
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('')
    const payload = { ...form, price: Number(form.price), quantityInStock: Number(form.quantityInStock), ...(editing ? { id: initial.id } : {}) }
    try {
      const result = editing ? await api.updateDrug(payload) : await api.addDrug(payload)
      onSaved(result?.message || (editing ? 'Medicine updated successfully.' : 'Medicine added successfully.'))
    } catch (e) { setError(e.message || 'Could not save medicine.') }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal"><div className="modal-heading"><div><div className="section-kicker">{editing ? 'UPDATE YOUR RECORD' : 'GROW YOUR INVENTORY'}</div><h2>{editing ? 'Edit medicine' : 'Add a medicine'}</h2><p>Enter the medicine details below.</p></div><button className="icon-btn" onClick={onClose}><X/></button></div><form onSubmit={submit} className="modal-form"><div className="form-grid">
    <label>Brand name<input name="brandName" value={form.brandName} onChange={change} required placeholder="e.g. Panadol"/></label><label>Generic name<input name="genericName" value={form.genericName} onChange={change} placeholder="e.g. Paracetamol"/></label>
    <label>Strength<input name="strength" value={form.strength} onChange={change} placeholder="e.g. 500mg"/></label><label>Dosage<input name="dosage" value={form.dosage} onChange={change} placeholder="e.g. Tablet"/></label>
    <label>Manufacturer<input name="manufacturer" value={form.manufacturer} onChange={change} placeholder="Manufacturer name"/></label><label>Batch number<input name="batchNumber" value={form.batchNumber} onChange={change} placeholder="Batch ID"/></label>
    <label>Manufacture date<input type="date" name="manufactureDate" value={form.manufactureDate || ''} onChange={change}/></label><label>Expiry date<input type="date" name="expiryDate" value={form.expiryDate || ''} onChange={change}/></label>
    <label>Unit price (₦)<input type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} required placeholder="0.00"/></label><label>Quantity in stock<input type="number" min="0" name="quantityInStock" value={form.quantityInStock} onChange={change} required placeholder="0"/></label>
    </div>{error && <div className="alert alert-error"><AlertTriangle size={15}/>{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-soft" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Add medicine'} <ArrowRight size={16}/></button></div></form></div></div>
}

function Inventory({ drugs, setDrugs, loading, error, refresh }) {
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [busy, setBusy] = useState(false)
  const filtered = drugs.filter(d => [d.brandName, d.genericName, d.manufacturer, d.batchNumber].join(' ').toLowerCase().includes(query.toLowerCase()))
  useEffect(() => { if (new URLSearchParams(location.search).get('add') === '1') setModal('new') }, [])
  const saved = async message => { setModal(null); setNotice(message); await refresh(); }
  const remove = async () => {
    setBusy(true)
    try { const res = await api.deleteDrug(deleteTarget.brandName); setNotice(res?.message || 'Medicine deleted.'); setDeleteTarget(null); await refresh() }
    catch (e) { setNotice(e.message || 'Could not delete medicine.') }
    finally { setBusy(false) }
  }
  return <><PageHeading kicker="MANAGE YOUR SHELVES" title="Medicine inventory" description="Keep your medicine records accurate and up to date." action={<button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={17}/> Add medicine</button>}/>
    <div className="inventory-summary"><div><span className="summary-label">PRODUCTS IN YOUR INVENTORY</span><strong>{loading ? '—' : drugs.length}</strong></div><div><span className="summary-label">TOTAL UNITS AVAILABLE</span><strong>{drugs.reduce((s,d) => s + Number(d.quantityInStock || 0),0).toLocaleString()}</strong></div><div><span className="summary-label">NEED REORDERING</span><strong className="summary-alert">{drugs.filter(d => Number(d.quantityInStock || 0) <= 10).length}</strong></div></div>
    {notice && <div className="alert alert-success"><Check size={16}/>{notice}<button onClick={() => setNotice('')}><X size={15}/></button></div>}
    {error && <div className="alert alert-error"><AlertTriangle size={16}/>{error}</div>}
    <section className="panel inventory-panel"><div className="inventory-toolbar"><div><h3>All medicines</h3><p>{filtered.length} records found</p></div><div className="toolbar-actions"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicines..."/>{query && <button onClick={() => setQuery('')}><X size={14}/></button>}</div><button className="btn btn-soft btn-small" onClick={refresh}><RefreshCw size={15}/> Refresh</button></div></div>
      <DrugTable drugs={filtered} loading={loading} onEdit={d => setModal(d)} onDelete={d => setDeleteTarget(d)}/>
    </section>
    {modal && <DrugModal initial={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={saved}/>}
    {deleteTarget && <div className="modal-backdrop"><div className="confirm-modal"><div className="confirm-icon"><Trash2/></div><h2>Delete this medicine?</h2><p><strong>{deleteTarget.brandName}</strong> will be removed from your inventory. This action cannot be undone.</p><div className="modal-actions"><button className="btn btn-soft" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="btn btn-danger" disabled={busy} onClick={remove}>{busy ? 'Deleting...' : 'Delete medicine'}</button></div></div></div>}
  </>
}

function Dispense({ drugs, refresh }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [selected, setSelected] = useState('')
  const [qty, setQty] = useState(1)
  const [customer, setCustomer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)
  const available = drugs.find(d => String(d.id) === selected)
  const add = () => {
    setError('')
    if (!available) return setError('Choose a medicine first.')
    if (Number(qty) < 1) return setError('Quantity must be at least one.')
    const existing = cart.find(i => i.id === available.id)
    const already = existing?.quantity || 0
    if (already + Number(qty) > Number(available.quantityInStock)) return setError(`Only ${available.quantityInStock} units are available.`)
    if (existing) setCart(cart.map(i => i.id === available.id ? { ...i, quantity: i.quantity + Number(qty) } : i))
    else setCart([...cart, { ...available, quantity: Number(qty) }])
    setSelected(''); setQty(1)
  }
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)
  const process = async () => {
    if (!cart.length) return setError('Add at least one medicine to the sale.')
    setBusy(true); setError('')
    try {
      const data = await api.sellDrugs({ name: user.userName, drugs: cart.map(i => ({ id: i.id, dosage: i.dosage, batchId: i.batchNumber, drugName: i.brandName, quantity: i.quantity })) })
      setReceipt(data?.record || data); setCart([]); await refresh()
    } catch (e) { setError(e.message || 'The sale could not be completed.') }
    finally { setBusy(false) }
  }
  return <><PageHeading kicker="SERVE WITH CONFIDENCE" title="Dispense & sales" description="Build a sale, confirm quantities and update your stock in one step."/>
    {receipt && <div className="receipt-banner"><div className="receipt-check"><Check/></div><div><strong>Sale completed successfully</strong><p>Sale #{receipt.saleId ?? 'recorded'} · {receipt.quantitySold ?? '—'} units · {money(receipt.amount)}</p></div><button className="icon-btn" onClick={() => setReceipt(null)}><X/></button></div>}
    <div className="sales-layout"><section className="panel sale-builder"><div className="panel-heading"><div><h3>New sale</h3><p>Select a medicine and quantity to add it to the sale.</p></div><span className="sale-step">01 / 02</span></div>
      <div className="sale-fields"><label>Choose medicine<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Select from inventory</option>{drugs.filter(d => Number(d.quantityInStock) > 0).map(d => <option key={d.id} value={d.id}>{d.brandName} · {d.strength} ({d.quantityInStock} available)</option>)}</select></label><div className="qty-add-row"><label>Quantity<input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)}/></label><button className="btn btn-primary" onClick={add}><Plus size={17}/> Add to sale</button></div></div>
      {error && <div className="alert alert-error"><AlertTriangle size={15}/>{error}</div>}
      <div className="cart-heading"><strong>Sale items</strong><span>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span></div>
      {cart.length ? <div className="sale-items">{cart.map(item => <div className="sale-item" key={item.id}><span className="medicine-avatar"><Pill size={17}/></span><div className="sale-item-info"><strong>{item.brandName}</strong><small>{item.strength} · {item.quantity} units</small></div><strong>{money(item.price * item.quantity)}</strong><button onClick={() => setCart(cart.filter(i => i.id !== item.id))} title="Remove"><X size={16}/></button></div>)}</div> : <div className="empty-sale"><ShoppingCart size={25}/><strong>Your sale is empty</strong><span>Add medicines to begin.</span></div>}
    </section><aside className="panel sale-summary"><div className="panel-heading"><div><h3>Sale summary</h3><p>Review before completing</p></div><div className="summary-basket"><ShoppingCart size={19}/></div></div><div className="summary-line"><span>Items</span><strong>{cart.reduce((s,i) => s + i.quantity,0)} units</strong></div><div className="summary-line"><span>Products</span><strong>{cart.length}</strong></div><div className="summary-divider"></div><div className="summary-total"><span>Total amount</span><strong>{money(total)}</strong></div><button className="btn btn-green checkout-btn" disabled={!cart.length || busy} onClick={process}>{busy ? 'Processing...' : 'Complete sale'} <ArrowRight size={17}/></button><div className="secure-note"><ShieldCheck size={15}/> Stock updates automatically after a successful sale.</div></aside></div>
  </>
}

export default function App() {
  return <AuthProvider><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<AuthLayout mode="login"/>}/><Route path="/register" element={<AuthLayout mode="register"/>}/><Route path="/app/*" element={<Protected><DashboardLayout/></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider>
}
