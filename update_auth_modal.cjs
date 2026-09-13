const fs = require('fs');
let content = fs.readFileSync('src/components/AuthModal.jsx', 'utf8');

// Replace default role 'buyer' -> 'user'
content = content.replace(
  "const [role, setRole] = useState('buyer');",
  "const [role, setRole] = useState('user');"
);

// Replace the Account Type Select options
const oldSelectOptions = `<option value="buyer">{isAr ? 'مشتري' : 'Buyer'}</option>
                  <option value="creator">{isAr ? 'صانع محتوى' : 'Creator'}</option>
                  <option value="merchant">{isAr ? 'تاجر' : 'Merchant'}</option>`;
                  
const newSelectOptions = `<option value="user">{isAr ? 'مستخدم' : 'User'}</option>
                  <option value="merchant">{isAr ? 'تاجر' : 'Merchant'}</option>
                  <option value="driver">{isAr ? 'سائق' : 'Driver'}</option>`;

content = content.replace(oldSelectOptions, newSelectOptions);

// Replace email input type and placeholder
const oldEmailInput = `<label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder="name@example.com"
            />`;

const newEmailInput = `<label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'البريد الإلكتروني أو اسم المستخدم' : 'Username or Email'}
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder={isAr ? 'اسم المستخدم أو البريد' : 'admin or name@example.com'}
            />`;

content = content.replace(oldEmailInput, newEmailInput);

fs.writeFileSync('src/components/AuthModal.jsx', content);
