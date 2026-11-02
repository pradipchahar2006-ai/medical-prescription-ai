
import { useState } from "react";
import { Stethoscope, Menu, X, LayoutDashboard, FileUp, History } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
// import {  useLocation } from "react-router-dom";

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const location = useLocation();

    const closeSidebar = () => setSidebarOpen(false);

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Upload Prescription", path: "/Upload", icon: FileUp },
        { name: "Prescription History", path: "/prescription-history", icon: History },
    ];

    return (
        <>
            {/* Top Navbar */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100"
                            aria-label="Open navigation menu"
                            aria-expanded={sidebarOpen}
                        >
                            <Menu size={24} />
                            
                        </button>

                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                                <Stethoscope size={20} />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                PresExtract AI
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/login"
                            className="rounded-xl p-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:px-3"
                        >
                            Log in
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 sm:px-4"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            {/* Dark overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={closeSidebar}
                />
            )}

            {/* Slide-in sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-slate-950 text-slate-200 shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-hidden={!sidebarOpen}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="text-teal-400" size={23} />
                        <span className="font-bold text-white">PresExtract AI</span>
                    </div>

                    <button
                        onClick={closeSidebar}
                        className="rounded-lg p-2 hover:bg-slate-800"
                        aria-label="Close navigation menu"
                    >
                        <X size={21} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Workspace
                    </p>

                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                                        ? "bg-green-500/15 text-green-300"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <p className="text-xs leading-5 text-slate-400">
                        Extracted prescription information may contain errors. Verify
                        details against the original prescription.
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
