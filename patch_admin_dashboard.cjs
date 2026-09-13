const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// Imports
content = content.replace(
  "import { AdminService } from '../services/AdminService';",
  `import { AdminService } from '../services/AdminService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';`
);

// State
content = content.replace(
  "const [loading, setLoading] = useState(true);",
  `const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  const chartData = [
    { name: 'Mon', GMV: 12000 },
    { name: 'Tue', GMV: 19000 },
    { name: 'Wed', GMV: 15000 },
    { name: 'Thu', GMV: 22000 },
    { name: 'Fri', GMV: 28000 },
    { name: 'Sat', GMV: 34000 },
    { name: 'Sun', GMV: 24000 },
  ];`
);

// Update Overview Content
const chartHtml = `
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <h3 className="font-bold text-slate-900 mb-6">{isAr ? 'حجم المعاملات (أخر 7 أيام)' : 'GMV Trend (Last 7 Days)'}</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="GMV" stroke="#d00000" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
`;

content = content.replace(
  "</div>\n        </div>\n      )}",
  "</div>\n" + chartHtml + "        </div>\n      )}"
);

// Update Edit Button in Users Table
content = content.replace(
  /<button className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 bg-blue-50 rounded">Edit<\/button>/g,
  `<button onClick={() => setEditingUser(u)} className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 bg-blue-50 rounded">Edit</button>`
);

// Add Edit Modal at the bottom
const modalHtml = `
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{isAr ? 'تعديل المستخدم' : 'Edit User'}</h3>
              <button onClick={() => setEditingUser(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'الاسم' : 'Name'}</label>
                <input type="text" defaultValue={editingUser.name} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'الدور (Role)' : 'Role'}</label>
                <select defaultValue={editingUser.role || 'buyer'} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-slate-900">
                  <option value="buyer">Buyer</option>
                  <option value="creator">Creator</option>
                  <option value="merchant">Merchant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    // Update user logic here
                    setEditingUser(null);
                  }}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-black transition-colors"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  "    </div>\n  );\n}",
  modalHtml + "    </div>\n  );\n}"
);

fs.writeFileSync('src/pages/AdminDashboard.jsx', content);
console.log("AdminDashboard patched!");
