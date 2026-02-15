import { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, Check, Copy, Terminal, Loader2, Lock, Eye, Server } from 'lucide-react';

function App() {
    const [requirement, setRequirement] = useState('');
    const [loading, setLoading] = useState(false);
    const [testCases, setTestCases] = useState([]);
    const [error, setError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const handleGenerate = async () => {
        if (!requirement.trim()) return;

        setLoading(true);
        setError(null);
        setTestCases([]);

        try {
            const response = await axios.post('/api/generate-cases', { requirement });
            // Backend now returns an array directly: [{ id, type, test_scenario, payload, expected_result }]
            if (Array.isArray(response.data)) {
                setTestCases(response.data);
            } else {
                // Fallback if it's wrapped
                setTestCases(response.data.test_cases || []);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to generate test cases. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const renderTestCaseCard = (tc) => {
        const typeUpper = (tc.type || '').toUpperCase();
        const isSQLi = typeUpper.includes('SQL');
        const isAuth = typeUpper.includes('BOLA') || typeUpper.includes('AUTH');

        let badgeColor = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        let icon = <Server className="w-4 h-4" />;

        if (isSQLi) {
            badgeColor = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            icon = <Terminal className="w-4 h-4" />;
        } else if (isAuth) {
            badgeColor = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            icon = <Lock className="w-4 h-4" />;
        }

        const uniqueId = tc.id || Math.random().toString();

        return (
            <div key={uniqueId} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-emerald-500/30 transition-all duration-300 shadow-lg shadow-black/20 group animate-in fade-in slide-in-from-bottom-3">
                <div className="flex justify-between items-start mb-3">
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeColor}`}>
                        {icon}
                        <span>{tc.type}</span>
                    </div>
                    <span className="text-slate-500 text-xs font-mono">{tc.id}</span>
                </div>

                <h3 className="text-slate-100 font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                    {tc.test_scenario}
                </h3>

                <div className="space-y-3 mt-4">
                    {/* Payload Section */}
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1.5 flex items-center justify-between">
                            <span>Attack Payload</span>
                        </div>
                        <div className="bg-slate-950 rounded-lg border border-slate-700/50 p-3 relative group/payload">
                            <code className="text-emerald-400 font-mono text-sm break-all pr-8 block">
                                {tc.payload}
                            </code>
                            <button
                                onClick={() => copyToClipboard(tc.payload, uniqueId)}
                                className="absolute top-2 right-2 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover/payload:opacity-100"
                                title="Copy Payload"
                            >
                                {copiedId === uniqueId ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Expected Result Section */}
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Expected Result
                        </span>
                        <span className="text-slate-300 text-sm">
                            {tc.expected_result}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <Shield className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            AI Security Gen
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">Automated Vulnerability Scanner</p>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Input Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl shadow-black/20 sticky top-24">
                            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-emerald-500" />
                                Target Analysis
                            </label>
                            <textarea
                                value={requirement}
                                onChange={(e) => setRequirement(e.target.value)}
                                placeholder="Describe your endpoint or feature (e.g., 'GET /api/users/{id} endpoint that retrieves user profile based on ID parameter')"
                                className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none transition-all text-sm leading-relaxed"
                            />

                            <div className="mt-4 flex flex-col gap-3">
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !requirement.trim()}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Scanning Models...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Generate Security Tests
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 text-center">
                                    Multi-Model Fallback: Gemini 2.0 / 1.5
                                </p>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 text-rose-400 animate-in fade-in slide-in-from-bottom-2">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Context/Help */}
                        {!testCases.length && !error && (
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 border-dashed text-center">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-700">
                                    <Terminal className="w-6 h-6 text-slate-500" />
                                </div>
                                <h3 className="text-slate-300 font-medium mb-1">Ready to Scan</h3>
                                <p className="text-slate-500 text-sm">
                                    Enter your requirements. The system will auto-retry across multiple Gemini models if rate limits are hit.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-8">
                        {testCases.length > 0 ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                        Security Test Cases
                                    </h2>
                                    <span className="text-slate-400 text-sm">{testCases.length} generated</span>
                                </div>

                                <div className="grid gap-4">
                                    {testCases.map((tc) => renderTestCaseCard(tc))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 min-h-[400px]">
                                <Shield className="w-24 h-24 opacity-20" />
                                <p className="text-lg font-medium">Waiting for input...</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

export default App;
