import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Settings, Users, FileText, LogOut, Plus, Map, Briefcase, LayoutDashboard, Globe, ChevronRight } from 'lucide-react';
import MonthlyReport from './MonthlyReport';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="animated-bg"></div>
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 glass-card m-4 md:mr-0 p-6 space-y-8 flex flex-col">
                <div className="text-center">
                    <h2 className="text-xl font-black italic tracking-tighter text-blue-400">ADMIN CONTROL</h2>
                    <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">Management Layer</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink to="/admin/config" icon={<Settings size={20} />} label="Org Config" active={location.pathname === '/admin/config'} />
                    <SidebarLink to="/admin/employees" icon={<Users size={20} />} label="Employees" active={location.pathname === '/admin/employees'} />
                    <SidebarLink to="/admin/logs" icon={<FileText size={20} />} label="Attendance Logs" active={location.pathname === '/admin/logs'} />
                    
                    <Link to="/dashboard" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors text-slate-400 mt-8">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">User Dashboard</span>
                    </Link>
                </nav>

                <button onClick={logout} className="glass-button flex items-center justify-center gap-2 text-red-400 border-red-500/10 hover:bg-red-500/10 hover:text-red-300 mt-auto">
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <Routes>
                    <Route path="config" element={<OrgConfig />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="logs" element={<MonthlyReport />} />
                    <Route path="/" element={<Navigate to="config" />} />
                </Routes>
            </main>
        </div>
    );
};

const SidebarLink = ({ to, icon, label }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium 
                   ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="text-sm font-bold tracking-tight">{label}</span>
    </Link>
);

const OrgConfig = () => {
    const [orgs, setOrgs] = useState([]);
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [radius, setRadius] = useState(100);
    const [dept, setDept] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        const { data } = await api.get('/org');
        setOrgs(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/org', {
                name,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                geofenceRadius: parseInt(radius),
                departments
            });
            alert("Organization Saved!");
            fetchOrgs();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save org");
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/attendance/export-excel', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Attendance_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Export failed");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center gap-3 italic tracking-tight">
                    <Map className="text-primary" /> Organization Setup
                </h1>
                <button onClick={handleExport} className="glass-button !w-auto px-6 flex items-center gap-2 bg-green-500/10 border-green-500/20 hover:bg-green-500/20">
                    <FileText size={18} /> Export Reports (Excel)
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">Organization Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Latitude</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Longitude</label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400">Geofence Radius (meters)</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" type="number" value={radius} onChange={e => setRadius(e.target.value)} required />
                    </div>
                    <button type="submit" className="glass-button w-full">Save Configuration</button>
                </form>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Configured Locations</h3>
                    {orgs.map(org => (
                        <div key={org._id} className="glass-card p-4 border-l-4 border-primary">
                            <p className="font-bold">{org.name}</p>
                            <p className="text-xs text-slate-400">{org.location.latitude}, {org.location.longitude} • Radius: {org.geofenceRadius}m</p>
                            <p className="text-xs text-primary mt-2">ID: {org._id}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const EmployeeManagement = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        staffId: '',
        department: '',
        collegeName: '',
        organization: ''
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { ...formData, role: 'employee' });
            alert("Employee Registered Successfully!");
            setFormData({ firstName: '', lastName: '', email: '', password: '', staffId: '', department: '', collegeName: '', organization: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="text-primary" /> Employee Management
            </h1>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Add New Employee</h3>
                <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Staff ID</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Department</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">College Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Organization ID</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-primary/50" placeholder="Paste ID from Config" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="glass-button md:col-span-2">
                        {loading ? "Registering..." : "Register Employee"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

const AttendanceLogs = () => {
    // Basic implementation for viewing logs
    return (
        <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Attendance Logs</h2>
            <p className="text-slate-400 italic">Review master attendance records and check-in times.</p>
        </div>
    );
};

export default AdminDashboard;
