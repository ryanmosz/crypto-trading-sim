# 🔐 Security Guidelines

## ⚠️ NEVER Commit These to Git:

1. **Service Role Keys** (starts with `eyJ...` and contains `"role":"service_role"`)
2. **API Keys** (any third-party service keys)
3. **Database passwords**
4. **Private keys** (`.pem`, `.key` files)
5. **Environment files** containing real credentials

## ✅ Best Practices:

### 1. Use Placeholder Values
```javascript
// ❌ BAD - Never commit real keys
SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// ✅ GOOD - Use placeholders
SUPABASE_SERVICE_ROLE_KEY: 'YOUR_SERVICE_ROLE_KEY_HERE'
```

### 2. Environment Variables
- Keep real keys in `.env.local` (never committed)
- Commit `.env.example` with placeholders
- Document where to find keys in comments

### 3. Anon Keys vs Service Keys
- **Anon keys** (role: "anon") = OK to expose in frontend
- **Service keys** (role: "service_role") = NEVER expose, backend only!

### 4. Git History
If you accidentally commit a secret:
1. Remove it immediately
2. Rotate the key in the service dashboard
3. Consider using `git filter-branch` or BFG Repo-Cleaner to remove from history

### 5. Pre-commit Checks
Consider using tools like:
- `git-secrets`
- `truffleHog`
- GitHub secret scanning

## 📋 Quick Check Before Committing:
- [ ] No service role keys in any file
- [ ] No API keys with write permissions
- [ ] All sensitive files in `.gitignore`
- [ ] Used placeholders instead of real values
- [ ] Documented where to get real keys

## 🚨 If a Secret is Exposed:
1. **Rotate immediately** - Don't wait!
2. Check logs for unauthorized access
3. Update all services using the old key
4. Review security practices

Remember: It's better to be overly cautious with secrets than to risk exposure!