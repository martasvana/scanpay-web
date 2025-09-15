# Nastavení Environment Variables pro ScanPay Kontaktní Formulář

## Potřebné ENV proměnné

Přidejte následující proměnné do vašeho `.env.local` souboru:

```env
# SMTP Server Settings
EMAIL_HOST=smtp.cesky-hosting.cz
EMAIL_PORT=587
EMAIL_SECURE=false

# Email Authentication
EMAIL_USERNAME=podpora@scanpay.cz
EMAIL_PASSWORD=vaše_skutečné_heslo_zde

# Email Addresses
EMAIL_FROM=podpora@scanpay.cz
EMAIL_TO=podpora@scanpay.cz

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=váš_recaptcha_secret_key_zde
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=váš_recaptcha_site_key_zde
```

## Jak získat Google reCAPTCHA v3 klíče

1. **Jděte na Google reCAPTCHA admin konzoli:**
   - https://www.google.com/recaptcha/admin/create

2. **Vytvořte nový site:**
   - Label: "ScanPay Contact Form"
   - reCAPTCHA type: **reCAPTCHA v3** (Score based)
   - Domains: přidejte vaši doménu (např. `scanpay.cz`, `www.scanpay.cz`)
   - Pro development také přidejte: `localhost`

3. **Po vytvoření získáte:**
   - **Site Key** → použijte jako `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Secret Key** → použijte jako `RECAPTCHA_SECRET_KEY`

**Poznámka:** reCAPTCHA v3 funguje na pozadí a hodnotí uživatele na škále 0.0-1.0 (0.0 = bot, 1.0 = člověk). Naše aplikace používá práh 0.5 pro ochranu před spamem.

## Bezpečnostní poznámky

⚠️ **DŮLEŽITÉ:**
- `RECAPTCHA_SECRET_KEY` nikdy nevkládejte do klientského kódu
- `EMAIL_PASSWORD` držte v tajnosti
- Pro production používejte silná hesla
- Pravidelně rotujte API klíče

## Testování

Po nastavení všech proměnných:

1. **Vytvořte `.env.local` soubor** v root složce projektu
2. **Vložte všechny ENV proměnné** do `.env.local`
3. **Restartujte development server**: `npm run dev`
4. **Zkontrolujte console** - neměly by být žádné varování o chybějících klíčích
5. **Otevřete FAQ sekci** na stránce
6. **Klikněte na "Kontaktovat podporu"**
7. **Vyplňte formulář** - reCAPTCHA v3 poběží na pozadí automaticky
8. **Zkontrolujte email** na `EMAIL_TO` adrese

## Troubleshooting

### Email se neodesílá:
- Zkontrolujte SMTP nastavení
- Ověřte přihlašovací údaje
- Zkontrolujte firewall/port 587

### reCAPTCHA chyby:
- **'browser-error'**: SITE_KEY chybí nebo je neplatný
- **Missing domain**: Přidejte localhost a vaši doménu do reCAPTCHA settings
- **Console warnings**: Zkontrolujte vývojářskou konzoli pro detaily
- **Žlutá notifikace**: V development módu se zobrazí upozornění na chybějící klíče

### API chyby:
- Zkontrolujte browser console pro detaily
- Ověřte, že všechny ENV proměnné jsou nastaveny
- Restartujte server po změně ENV proměnných
- Zkontrolujte síťové chyby v Developer Tools

### Časti kroky pro rychlé řešení:
1. **Zkontrolujte `.env.local`** - musí být v root složce
2. **Ověřte názvy proměnných** - musí začínat `NEXT_PUBLIC_` pro klientské
3. **Restartujte server** po každé změně ENV
4. **Zkontrolujte console** pro chybové hlášky
